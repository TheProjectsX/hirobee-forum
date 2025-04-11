import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import authController from "./controllers/auth/index.js";

// Configuring App
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

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

// Test route
app.get("/test", (req, res) => {
    res.send({ success: true });
});

/* User Routes */
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
