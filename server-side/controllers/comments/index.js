import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

const insert_comment = async (user, postId, body, collection) => {
    if (!body?.content) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const doc = {
        postId: new ObjectId(String(postId)),
        authorId: user.username,
        content: body.content,
        upvotedBy: [],
        downvotedBy: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    const response = await collection.insertOne(doc);
    if (response.acknowledged === 0) {
        return {
            success: false,
            message: "Failed to add Comment",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }

    return {
        success: true,
        message: "Comment Added",
        id: response.insertedId,
        status_code: StatusCodes.CREATED,
    };
};

const update_comment = async (user, commentId, body, collection) => {
    let commentOid;

    try {
        commentOid = new ObjectId(String(commentId));
    } catch (error) {
        return {
            success: false,
            message: "Comment not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    if (!body?.content) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const response = await collection.updateOne(
        {
            authorId: user.username,
            _id: commentOid,
        },
        {
            $set: { content: body.content, updatedAt: Date.now() },
        }
    );

    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "Comment not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }
    return {
        success: true,
        message: "Comment Updated",
        status_code: StatusCodes.OK,
    };
};

const update_vote = async (user, commentId, meta, collection) => {
    let commentOid;

    try {
        commentOid = new ObjectId(String(commentId));
    } catch (error) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const doc = {};

    doc[meta.action === "add" ? "$addToSet" : "$pull"] = {
        [meta.target === "upvote" ? "upvotedBy" : "downvotedBy"]: user.username,
    };

    const response = await collection.updateOne({ _id: commentOid }, doc);

    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "Comment not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    } else if (response.modifiedCount === 0) {
        return {
            success: false,
            message: "Already performed this action",
            status_code: StatusCodes.NOT_FOUND,
        };
    }
    return {
        success: true,
        message: `Vote ${meta.action === "add" ? "Added" : "Removed"}`,
        status_code: StatusCodes.OK,
    };
};

const delete_comment = async (user, commentId, collection) => {
    let commentOid;

    try {
        commentOid = new ObjectId(String(commentId));
    } catch (error) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const response = await collection.deleteOne({
        authorId: user.username,
        _id: commentOid,
    });

    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "Comment not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }
    return {
        success: true,
        message: "Comment Deleted",
        status_code: StatusCodes.OK,
    };
};

export default { insert_comment, update_comment, update_vote, delete_comment };
