import { StatusCodes } from "http-status-codes";
import {
    commentAggregationPipeline,
    postAggregationPipeline,
    specificUserAggregationPipeline,
} from "../../utils/variables.js";
import { toNumber } from "../../utils/helpers.js";

const get_specific = async (username, user_collection) => {
    const response = await user_collection
        .aggregate([
            { $match: { username } },
            ...specificUserAggregationPipeline,
        ])
        .toArray();

    if (response.length === 0) {
        return {
            success: false,
            message: "User not Found!",
            query: {
                id: username,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    return {
        success: true,
        message: "User info Fetched",
        ...response[0],
        status_code: StatusCodes.OK,
    };
};

const fetch_posts = async (username, filters, collection) => {
    let { page = 1, limit = 10 } = filters;
    page = toNumber(page, 1);
    limit = toNumber(limit, 10);

    const query = { authorId: username };
    const sort = { createdAt: -1 };

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

const fetch_comments = async (username, filters, collection) => {
    let { page = 1, limit = 10 } = filters;
    page = toNumber(page, 1);
    limit = toNumber(limit, 10);

    const query = { authorId: username };
    const sort = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const response = await collection
        .aggregate([
            { $match: query },
            ...commentAggregationPipeline,
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
        message: "Comments Fetched",
        pagination,
        data: response,
        status_code: StatusCodes.OK,
    };
};

const report_user = async (
    user,
    username,
    data,
    reportsCollection,
    usersCollection
) => {
    if (!data?.report) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const targetUser = await usersCollection.findOne({ username });

    const reportBody = {
        username: targetUser.username,
        targetId: targetUser._id,
        targetType: "user",
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
            message: "User Reported!",
            status_code: StatusCodes.CREATED,
        };
    } else {
        return {
            success: false,
            message: "Failed to Report User",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }
};

export default { get_specific, fetch_posts, fetch_comments, report_user };
