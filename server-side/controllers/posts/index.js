import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import {
    commentAggregationPipeline,
    postAggregationPipeline,
    subhiroAggregationPipeline,
} from "../../utils/variables.js";
import { toNumber } from "../../utils/helpers.js";

const fetch_posts = async (filters, collection) => {
    let {
        query: search,
        page = 1,
        limit = 10,
        subhiro,
        author,
        sortBy = "new",
    } = filters;

    page = toNumber(page, 1);
    limit = toNumber(limit, 10);

    const query = {};
    const sort = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { body: { $regex: search, $options: "i" } },
        ];
    }

    if (subhiro) query.subhiro = subhiro;
    if (author) query.authorId = author;

    sort.createdAt = sortBy === "old" ? 1 : -1;

    const skip = (page - 1) * limit;

    const response = await collection
        .aggregate([
            { $match: query },
            ...postAggregationPipeline,
            { $sort: sort },
            { $skip: skip },
            { $limit: Number(limit) },
        ])
        .toArray();

    const totalCount = await collection.estimatedDocumentCount(query);
    const pagination = {
        has_next_page: totalCount > skip + response.length,
        current_page: page,
        current_count: response.length,
        total_count: totalCount,
        limit,
    };

    return {
        success: true,
        message: "Posts Fetched",
        pagination,
        data: response,
        status_code: StatusCodes.OK,
    };
};

const fetch_single_post = async (
    postId,
    postsCollection,
    subhiroCollection
) => {
    let postOid;

    try {
        postOid = new ObjectId(String(postId));
    } catch (error) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const response = await postsCollection
        .aggregate([
            {
                $match: {
                    _id: postOid,
                },
            },
            ...postAggregationPipeline,
            {
                $limit: 1,
            },
        ])
        .toArray();

    if (response.length === 0) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const postData = response[0];
    let subhiroData = null;
    let authorRecentPosts = null;

    if (postData.subhiro?.hironame) {
        const response = await subhiroCollection
            .aggregate([
                {
                    $match: {
                        hironame: {
                            $regex: `^${postData.subhiro?.hironame}$`,
                            $options: "i",
                        },
                    },
                },
                ...subhiroAggregationPipeline,
                {
                    $limit: 1,
                },
            ])
            .toArray();
        if (response.length > 0) {
            subhiroData = response[0];
        }
    } else {
        const response = await postsCollection
            .aggregate([
                {
                    $match: {
                        authorId: postData.author.username,
                    },
                },
                ...postAggregationPipeline,
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $limit: 6,
                },
            ])
            .toArray();

        authorRecentPosts = response;
    }

    return {
        success: true,
        message: "Post fetched",
        status_code: StatusCodes.OK,
        ...postData,
        subhiroData,
        authorRecentPosts,
    };
};

const update_vote = async (user, postId, target, collection) => {
    let postOid;

    try {
        postOid = new ObjectId(String(postId));
    } catch (error) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const targetPost = await collection.findOne(
        { _id: postOid },
        { projection: { upvotedBy: 1, downvotedBy: 1 } }
    );
    if (!targetPost) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
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

    const response = await collection.updateOne({ _id: postOid }, doc);

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

const fetch_comments = async (postId, filters, collection) => {
    let { page = 1, limit = 10 } = filters;
    page = toNumber(page, 1);
    limit = toNumber(limit, 10);

    const skip = (page - 1) * limit;

    const response = await collection

        .aggregate([
            { $match: { postId: new ObjectId(String(postId)) } },
            ...commentAggregationPipeline,
            { $skip: skip },
            { $limit: Number(limit) },
        ])
        .toArray();

    const totalCount = await collection.countDocuments({
        postId: new ObjectId(String(postId)),
    });

    const pagination = {
        has_next_page: totalCount > skip + response.length,
        current_page: page,
        current_count: response.length,
        total_count: totalCount,
        limit,
    };

    return {
        success: true,
        message: "Comments Fetched",
        pagination,
        data: response,
        status_code: StatusCodes.OK,
    };
};

const report_post = async (
    user,
    postId,
    data,
    reportsCollection,
    postsCollection
) => {
    if (!data?.report) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    let postOid;
    try {
        postOid = new ObjectId(String(postId));
    } catch (error) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const targetPost = await postsCollection.findOne({ _id: postOid });

    if (!targetPost) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const reportBody = {
        title: targetPost.title,
        author: targetPost.authorId,
        targetId: postOid,
        targetType: "post",
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
            message: "Post Reported!",
            status_code: StatusCodes.CREATED,
        };
    } else {
        return {
            success: false,
            message: "Failed to Report Post",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }
};

export default {
    fetch_posts,
    fetch_single_post,
    update_vote,
    fetch_comments,
    report_post,
};
