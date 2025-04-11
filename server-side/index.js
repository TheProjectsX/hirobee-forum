import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { userRegisterValidator } from "./utils/validators.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Configuring App
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

/* Middlewares */
// Error Handling
app.use((error, req, res, next) => {
    res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.internal_message || "Internal Server Error",
        error: error.message,
        status_code: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
    });
});

// Configuring Database
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
});
await client.connect();
const db = client.db("hirobee");

// Test route
app.get("/test", (req, res) => {
    res.send({ success: true });
});

/* User Routes */
// Register new User
app.post("/auth/register", async (req, res, next) => {
    const body = req.body;

    if (!userRegisterValidator(body)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        });
    }

    // Check if Username || Email already Exists
    try {
        const usernameExists = await db
            .collection("users")
            .findOne({ username: body.username });

        if (usernameExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Username Already Exists!",
                status_code: StatusCodes.BAD_REQUEST,
            });
        }

        const emailExists = await db
            .collection("users")
            .findOne({ email: body.email });

        if (emailExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Email Already Exists!",
                status_code: StatusCodes.BAD_REQUEST,
            });
        }
    } catch (error) {
        next(error);
    }

    // Add user to DB
    try {
        const hashedPassword = bcrypt.hashSync(body.password, 10);

        const userInfo = {
            username: body.username,
            email: body.email,
            password: hashedPassword,
            role: "author",
            createdAt: Date.now(),
        };

        const serverResponse = await db.collection("users").insertOne(userInfo);
        if (serverResponse.acknowledged) {
            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "User Created Successfully!",
                status_code: StatusCodes.CREATED,
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to Create User",
                status_code: StatusCodes.INTERNAL_SERVER_ERROR,
            });
        }
    } catch (error) {
        return next(error);
    }
});

// Login new User
app.post("/auth/login", async (req, res, next) => {
    const body = req.body;

    if (!body.email || !body.password) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid Credentials",
            status_code: StatusCodes.UNAUTHORIZED,
        });
    }

    try {
        const targetUser = await db.collection("users").findOne({
            $or: [{ username: body.email }, { email: body.email }],
        });
        if (!targetUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Credentials",
                status_code: StatusCodes.UNAUTHORIZED,
            });
        }

        const { password: hashedPassword, ...userInfo } = targetUser;

        const authorized = bcrypt.compareSync(body.password, hashedPassword);
        if (!authorized) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Invalid Credentials",
                status_code: StatusCodes.UNAUTHORIZED,
            });
        }

        return res
            .status(StatusCodes.OK)
            .json({ success: true, status_code: StatusCodes.OK, ...userInfo });
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});
