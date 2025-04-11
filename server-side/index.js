import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { MongoClient, ServerApiVersion } from "mongodb";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

// Controllers
import authController from "./controllers/auth/index.js";
import currentUserController from "./controllers/me/index.js";

// Configuring App
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());

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

// Cookie control options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

/* Custom Middlewares */
// Error Middleware
const errorHandleMiddleware = (error, req, res, next) => {
    res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.internal_message || "Internal Server Error",
        error: error.message,
        status_code: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
    });
};

// Check Authentication Middleware
const checkAuthentication = (req, res, next) => {
    const { access_token = "" } = req.cookies;

    try {
        const decrypted = jwt.verify(access_token, process.env.JWT_SECRET);
        req.user = decrypted;
    } catch (error) {
        return res
            .clearCookie("access_token", cookieOptions)
            .status(StatusCodes.UNAUTHORIZED)
            .json({
                success: false,
                message: "Authentication Failed",
                status_code: StatusCodes.UNAUTHORIZED,
            });
    }

    next();
};

// Test route
app.get("/test", (req, res) => {
    res.send({ success: true });
});

/* Authentication Routes */
// Register new User
app.post("/auth/register", async (req, res, next) => {
    const body = req.body;
    try {
        const response = await authController.register(
            body,
            db.collection("users")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Login new User
app.post("/auth/login", async (req, res, next) => {
    const body = req.body;

    try {
        const response = await authController.login(
            body,
            db.collection("users")
        );

        if (response.success) {
            const token = jwt.sign(
                { email: response.email, role: response.role },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || "2d",
                }
            );
            return res
                .cookie("access_token", token, cookieOptions)
                .status(response.status_code)
                .json(response);
        }
        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Logout User
app.get("/auth/logout", checkAuthentication, async (req, res, next) => {
    res.clearCookie("access_token", cookieOptions).status(StatusCodes.OK).json({
        success: true,
        message: "Logout Successful",
        status_code: StatusCodes.OK,
    });
});

/* Current User Routes */
// Get current user Information
app.get("/me", checkAuthentication, async (req, res, next) => {
    const user = req.user;

    try {
        const response = await currentUserController.fetch_info(
            user,
            db.collection("users")
        );
        if (!response.success) {
            return res
                .clearCookie("access_token", cookieOptions)
                .status(response.status_code)
                .json(response);
        }

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Update user Profile Information
app.put("/me", checkAuthentication, async (req, res, next) => {
    const body = req.body;

    try {
        const response = await currentUserController.update_info(
            req.user,
            body,
            db.collection("users")
        );
        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Error Handling
app.use(errorHandleMiddleware);

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});
