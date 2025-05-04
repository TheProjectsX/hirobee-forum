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

const update_vote = async (user, commentId, target, collection) => {
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

    const targetPost = await collection.findOne(
        { _id: commentOid },
        { projection: { upvotedBy: 1, downvotedBy: 1 } }
    );
    if (!targetPost) {
        return {
            success: false,
            message: "Comment not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const doc = {};
    const returnResponse = {};

    if (target === "upvote") {
        if (targetPost.upvotedBy.includes(user.username)) {
            doc["$pull"] = {
                upvotedBy: user.username,
            };
            returnResponse["newCount"] = targetPost.upvotedBy.length - 1;
            returnResponse["action"] = "removed";
        } else {
            doc["$addToSet"] = {
                upvotedBy: user.username,
            };
            returnResponse["newCount"] = targetPost.upvotedBy.length + 1;
            returnResponse["action"] = "added";
        }
    } else if (target === "downvote") {
        if (targetPost.downvotedBy.includes(user.username)) {
            doc["$pull"] = {
                downvotedBy: user.username,
            };
            returnResponse["newCount"] = targetPost.downvotedBy.length - 1;
            returnResponse["action"] = "removed";
        } else {
            doc["$addToSet"] = {
                downvotedBy: user.username,
            };
            returnResponse["newCount"] = targetPost.downvotedBy.length + 1;
            returnResponse["action"] = "added";
        }
    }

    const response = await collection.updateOne({ _id: commentOid }, doc);

    if (response.modifiedCount === 0) {
        return {
            success: false,
            message: "Failed to Update Vote",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }
    return {
        success: true,
        message: `Vote ${returnResponse.action}`,
        status_code: StatusCodes.OK,
        ...returnResponse,
    };
};
const delete_comment = async (user, commentId, collection) => {
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

const report_comment = async (
    user,
    commentId,
    data,
    reportsCollection,
    commentsCollection
) => {
    if (!data?.report) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

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

    const targetComment = await commentsCollection.findOne({ _id: commentOid });

    if (!targetComment) {
        return {
            success: false,
            message: "Comment not Found!",
            query: {
                id: commentId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const reportBody = {
        content: targetComment.content,
        author: targetComment.authorId,
        targetId: commentOid,
        targetType: "comment",
        report: data.report,
        reportedBy: user.username,
        meta: {},
        status: "pending",
        createdAt: Date.now(),
    };

    const response = await reportsCollection.insertOne(reportBody);

    if (response.acknowledged) {
        return {
            success: true,
            message: "Comment Reported!",
            status_code: StatusCodes.CREATED,
        };
    } else {
        return {
            success: false,
            message: "Failed to Report Comment",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }
};

export default {
    insert_comment,
    update_comment,
    update_vote,
    delete_comment,
    report_comment,
};
