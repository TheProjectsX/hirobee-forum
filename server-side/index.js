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
import usersController from "./controllers/users/index.js";
import postsController from "./controllers/posts/index.js";
import commentsController from "./controllers/comments/index.js";
import subhiroController from "./controllers/subhiro/index.js";
import adminController from "./controllers/admin/index.js";

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

// Check Role
const checkAdminPrivilege = async (req, res, next) => {
    const user = req.user;

    try {
        const targetUser = await db
            .collection("users")
            .findOne({ username: user.username });

        if (!targetUser) {
            return res
                .clearCookie("access_token", cookieOptions)
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    success: false,
                    message: "Authentication Failed!",
                    status_code: StatusCodes.UNAUTHORIZED,
                });
        }
        if (targetUser.role !== "admin") {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Forbidden Request",
                status_code: StatusCodes.FORBIDDEN,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

const checkModPrivilege = async (req, res, next) => {
    const user = req.user;

    try {
        const targetUser = await db
            .collection("users")
            .findOne({ username: user.username });

        if (!targetUser) {
            return res
                .clearCookie("access_token", cookieOptions)
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    success: false,
                    message: "Authentication Failed!",
                    status_code: StatusCodes.UNAUTHORIZED,
                });
        }
        if (!["admin", "moderator"].includes(targetUser.role)) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Forbidden Request",
                status_code: StatusCodes.FORBIDDEN,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
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
                {
                    email: response.email,
                    username: response.username,
                },
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
    const user = req.user;
    const body = req.body;

    try {
        const response = await currentUserController.update_info(
            user,
            body,
            db.collection("users")
        );
        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get current user Posts
app.get("/me/posts", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const query = req.query;

    try {
        const response = await currentUserController.fetch_posts(
            user,
            query,
            db.collection("posts")
        );
        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get a single Post
app.get("/me/posts/:id", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const postId = req.params.id;

    try {
        const response = await currentUserController.fetch_single_post(
            user,
            postId,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Create new Post
app.post("/me/posts", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const body = req.body;

    try {
        const response = await currentUserController.create_post(
            user,
            body,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Update post
app.put("/me/posts/:id", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const postId = req.params.id;
    const body = req.body;

    try {
        const response = await currentUserController.update_post(
            user,
            postId,
            body,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Delete Post
app.delete("/me/posts/:id", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const postId = req.params.id;

    try {
        const response = await currentUserController.delete_post(
            user,
            postId,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

/* Public User Routes */
// Get User via Username
app.get("/users/:username", async (req, res, next) => {
    const username = req.params.username;

    try {
        const response = await usersController.get_specific(
            username,
            db.collection("users"),
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get User's Posts
app.get("/users/:username/posts", async (req, res, next) => {
    const username = req.params.username;

    try {
        const response = usersController.fetch_posts(
            username,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

/* Public Post Routes */
// TODO: ADD GET_COMMENTS
// Get all Posts
app.get("/posts", async (req, res, next) => {
    const query = req.query;

    try {
        const response = await postsController.fetch_posts(
            query,
            db.collection("posts")
        );
        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get a single Post
app.get("/posts/:id", async (req, res, next) => {
    const postId = req.params.id;

    try {
        const response = await postsController.fetch_single_post(
            postId,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get post Comments
app.get("/posts/:id/comments", async (req, res, next) => {
    const postId = req.params.id;
    const query = req.query;

    try {
        const response = await postsController.fetch_comments(
            postId,
            query,
            db.collection("comments")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

/* Private Post Routes */
// Update Votes
app.put(
    "/posts/:id/:target/:action",
    checkAuthentication,
    async (req, res, next) => {
        const user = req.user;
        const { id: postId, target, action } = req.params;

        if (
            !["upvote", "downvote"].includes(target) ||
            !["add", "remove"].includes(action)
        ) {
            return res.sendStatus(404);
        }

        try {
            const response = await postsController.update_vote(
                user,
                postId,
                { target, action },
                db.collection("posts")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

/* Private Comment Routes */

// Add Comment
app.post("/posts/:id/comments", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const postId = req.params.id;
    const body = req.body;

    try {
        const response = await commentsController.insert_comment(
            user,
            postId,
            body,
            db.collection("comments")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Delete Comment
app.delete("/comments/:id", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const commentId = req.params.id;

    try {
        const response = await commentsController.delete_comment(
            user,
            commentId,
            db.collection("comments")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Update Votes
app.put(
    "/comments/:id/:target/:action",
    checkAuthentication,
    async (req, res, next) => {
        const user = req.user;
        const { id: commentId, target, action } = req.params;

        if (
            !["upvote", "downvote"].includes(target) ||
            !["add", "remove"].includes(action)
        ) {
            return res.sendStatus(404);
        }

        try {
            const response = await commentsController.update_vote(
                user,
                commentId,
                { target, action },
                db.collection("comments")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

/* Public SubHiro Routes */
// Get SubHiro Details
app.get("/subhiro/:id", async (req, res, next) => {
    const subhiroId = req.params.id;

    try {
        const response = await subhiroController.fetch_details(
            subhiroId,
            db.collection("subhiro")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get SubHiro Posts
app.get("/subhiro/:id/posts", async (req, res, next) => {
    const subhiroId = req.params.id;
    const query = req.query;

    try {
        const response = await subhiroController.fetch_posts(
            subhiroId,
            query,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

/* Protected SubHiro Routes */

// Create new Subhiro
app.post(
    "/subhiro",
    checkAuthentication,
    checkModPrivilege,
    async (req, res, next) => {
        const user = req.user;
        const body = req.body;

        try {
            const response = await subhiroController.create_subhiro(
                user,
                body,
                db.collection("subhiro")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

/* Protected Admin Routes */

// Get Stats of Forum
app.get(
    "/admin/stats",
    checkAuthentication,
    checkAdminPrivilege,
    async (req, res, next) => {
        try {
            const response = await adminController.fetch_stats(
                db.collection("users"),
                db.collection("posts"),
                db.collection("comments"),
                db.collection("subhiro")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Get All Users
app.get(
    "/admin/users",
    checkAuthentication,
    checkAdminPrivilege,
    async (req, res, next) => {
        const query = req.query;

        try {
            const response = await adminController.fetch_users(
                query,
                {},
                db.collection("users")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Get Banned Users
app.get(
    "/admin/users/banned",
    checkAuthentication,
    checkAdminPrivilege,
    async (req, res, next) => {
        const query = req.query;

        try {
            const response = await adminController.fetch_users(
                query,
                { status: "banned" },
                db.collection("users")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Change User Role
app.put(
    "/admin/users/:id/role/:role",
    checkAdminPrivilege,
    async (req, res, next) => {
        const user = req.user;
        const targetId = req.params.id;
        const role = req.params.role;

        if (!["author", "moderator"].includes(role)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Only role to `author` and `moderator` is changeable",
                status_code: StatusCodes.BAD_REQUEST,
            });
        }

        try {
            const response = await adminController.change_user_role(
                user,
                targetId,
                role,
                db.collection("users")
            );
            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

/* Protected Moderator Routes (Also access-able by Admin) */
app.put(
    "/moderator/users/:id/status/:status",
    checkModPrivilege,
    async (req, res, next) => {
        const user = req.user;
        const targetId = req.params.id;
        const status = req.params.status;

        if (!["active", "banned"].includes(status)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Only status to `active` and `banned` is changeable",
                status_code: StatusCodes.BAD_REQUEST,
            });
        }

        try {
            const response = await adminController.change_user_status(
                user,
                targetId,
                status,
                db.collection("users")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Error Handling
app.use(errorHandleMiddleware);

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});
