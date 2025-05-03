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
app.use(
    cors({
        origin: ["http://localhost:3000", "http://192.168.2.106:3000"],
        credentials: true,
    })
);
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
const checkAuthentication = async (req, res, next) => {
    const { access_token = "" } = req.cookies;

    try {
        const decrypted = jwt.verify(access_token, process.env.JWT_SECRET);
        const targetUser = await db
            .collection("users")
            .findOne({ username: decrypted?.username });

        if (!targetUser) {
            return res
                .clearCookie("access_token", cookieOptions)
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    success: false,
                    message: "Authentication Failed",
                    status_code: StatusCodes.UNAUTHORIZED,
                });
        }

        const { password, ...userInfo } = targetUser;

        req.user = userInfo;
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
            .findOne({ username: user?.username });

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
            .findOne({ username: user?.username });

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

        if (response.success) {
            const token = jwt.sign(
                {
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
app.post("/auth/logout", checkAuthentication, async (req, res, next) => {
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

// Join Subhiro
app.put("/me/subhiro/:id/join", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const subhiroId = req.params.id;

    try {
        const response = await currentUserController.join_subhiro(
            user,
            subhiroId,
            db.collection("users"),
            db.collection("subhiro")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Leave Subhiro
app.put(
    "/me/subhiro/:id/leave",
    checkAuthentication,
    async (req, res, next) => {
        const user = req.user;
        const subhiroId = req.params.id;

        try {
            const response = await currentUserController.leave_subhiro(
                user,
                subhiroId,
                db.collection("users")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

/* Public User Routes */
// Get User via Username
app.get("/users/:username", async (req, res, next) => {
    const username = req.params.username;

    try {
        const response = await usersController.get_specific(
            username,
            db.collection("users")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get User's Posts
app.get("/users/:username/posts", async (req, res, next) => {
    const username = req.params.username;
    const query = req.query;

    try {
        const response = await usersController.fetch_posts(
            username,
            query,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Get User's Comments
app.get("/users/:username/comments", async (req, res, next) => {
    const username = req.params.username;
    const query = req.query;

    try {
        const response = await usersController.fetch_comments(
            username,
            query,
            db.collection("comments")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Report User
app.post(
    "/users/:username/report",
    checkAuthentication,
    async (req, res, next) => {
        const user = req.user;
        const body = req.body;
        const username = req.params.username;

        try {
            const response = await usersController.report_user(
                user,
                username,
                body,
                db.collection("reports"),
                db.collection("users")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

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
            db.collection("posts"),
            db.collection("subhiro")
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
app.put("/posts/:id/:target", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const { id: postId, target } = req.params;

    if (!["upvote", "downvote"].includes(target)) {
        return res.sendStatus(404);
    }

    try {
        const response = await postsController.update_vote(
            user,
            postId,
            target,
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

// Report Post
app.post("/posts/:id/report", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const body = req.body;
    const postId = req.params.id;

    try {
        const response = await postsController.report_post(
            user,
            postId,
            body,
            db.collection("reports"),
            db.collection("posts")
        );

        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

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

// Update Comment
app.put("/comments/:id", checkAuthentication, async (req, res, next) => {
    const user = req.user;
    const commentId = req.params.id;
    const body = req.body;

    try {
        const response = await commentsController.update_comment(
            user,
            commentId,
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
    "/comments/:id/:target/",
    checkAuthentication,
    async (req, res, next) => {
        const user = req.user;
        const { id: commentId, target } = req.params;

        if (!["upvote", "downvote"].includes(target)) {
            return res.sendStatus(404);
        }

        try {
            const response = await commentsController.update_vote(
                user,
                commentId,
                { target },
                db.collection("comments")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Report Comment
app.post(
    "/comments/:id/report",
    checkAuthentication,
    async (req, res, next) => {
        const user = req.user;
        const body = req.body;
        const commentId = req.params.id;

        try {
            const response = await commentsController.report_comment(
                user,
                commentId,
                body,
                db.collection("reports"),
                db.collection("comments")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

/* Public SubHiro Routes */
// Search for Subhiro
app.get("/subhiro/search", async (req, res, next) => {
    const query = req.query;

    try {
        const response = await subhiroController.search_subhiro(
            query,
            db.collection("subhiro")
        );
        res.status(response.status_code).json(response);
    } catch (error) {
        next(error);
    }
});

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
    "/moderator/subhiro",
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
    "/admin/users/:username/role/:role",
    checkAuthentication,
    checkAdminPrivilege,
    async (req, res, next) => {
        const user = req.user;
        const targetUsername = req.params.username;
        const role = req.params.role;

        if (!["admin", "moderator", "author"].includes(role)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message:
                    "Only role to `admin`, `moderator` and `author` is changeable",
                status_code: StatusCodes.BAD_REQUEST,
            });
        }

        try {
            const response = await adminController.change_user_role(
                user,
                targetUsername,
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

// Get Reported Users
app.get(
    "/moderator/reported/users",
    checkAuthentication,
    checkModPrivilege,
    async (req, res, next) => {
        const query = req.query;

        try {
            const response = await adminController.fetch_reports(
                "user",
                query,
                db.collection("reports")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Get Reported Posts
app.get(
    "/moderator/reported/posts",
    checkAuthentication,
    checkModPrivilege,
    async (req, res, next) => {
        const query = req.query;

        try {
            const response = await adminController.fetch_reports(
                "post",
                query,
                db.collection("reports")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Get Reported Comments
app.get(
    "/moderator/reported/comments",
    checkAuthentication,
    checkModPrivilege,
    async (req, res, next) => {
        const query = req.query;

        try {
            const response = await adminController.fetch_reports(
                "comment",
                query,
                db.collection("reports")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Ignore a Report
app.put(
    "/moderator/reports/:id/ignore",
    checkAuthentication,
    checkModPrivilege,
    async (req, res, next) => {
        const user = req.user;
        const targetId = req.params.id;

        try {
            const response = await adminController.ignore_report(
                user,
                targetId,
                db.collection("reports")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Delete a Reported Content
app.put(
    "/moderator/reports/:id/approve",
    checkAuthentication,
    checkModPrivilege,
    async (req, res, next) => {
        const user = req.user;
        const targetId = req.params.id;

        try {
            const response = await adminController.delete_reported(
                user,
                targetId,
                db.collection("reports"),
                db.collection("users"),
                db.collection("posts"),
                db.collection("comments")
            );

            res.status(response.status_code).json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Change User Statue
app.put(
    "/moderator/users/:username/status/:status",
    checkAuthentication,
    checkModPrivilege,
    async (req, res, next) => {
        const user = req.user;
        const targetUsername = req.params.username;
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
                targetUsername,
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
