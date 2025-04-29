import { StatusCodes } from "http-status-codes";
import { toNumber } from "../../utils/helpers.js";

const fetch_stats = async (
    usersCollection,
    postsCollection,
    commentsCollection,
    subhiroCollection
) => {
    const [
        totalUsers,
        totalPosts,
        totalComments,
        totalSubhiro,
        newUsersThisWeek,
        newPostsThisWeek,
    ] = await Promise.all([
        usersCollection.estimatedDocumentCount(),
        postsCollection.estimatedDocumentCount(),
        commentsCollection.estimatedDocumentCount(),
        subhiroCollection.estimatedDocumentCount(),
        usersCollection.countDocuments({
            createdAt: { $gte: Date.now() - 7 * 24 * 60 * 60 * 1000 },
        }),
        postsCollection.countDocuments({
            createdAt: { $gte: Date.now() - 7 * 24 * 60 * 60 * 1000 },
        }),
    ]);

    const response = {
        success: true,
        message: "Stats Parsed",
        total: {
            users: totalUsers,
            posts: totalPosts,
            comments: totalComments,
            subhiro: totalSubhiro,
        },
        this_week: {
            users: newUsersThisWeek,
            posts: newPostsThisWeek,
        },
        status_code: StatusCodes.OK,
    };

    return response;
};

const change_user_status = async (user, targetId, status, collection) => {
    const doc = {
        status,
    };

    if (status === "banned") {
        doc["meta.bannerBy"] = user.username;
        doc["meta.bannerAt"] = Date.now();
    }

    const response = await collection.updateOne(
        { username: targetId },
        { $set: doc }
    );

    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "User not Found!",
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    return {
        success: true,
        message: "User Banned",
        status_code: StatusCodes.OK,
    };
};

const change_user_role = async (user, targetId, role, collection) => {
    const doc = {
        role,
        "meta.roleUpdatedBy": user.username,
        "meta.roleUpdatedAt": Date.now(),
    };

    const response = await collection.updateOne(
        { username: targetId },
        { $ser: doc }
    );
    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "User not Found!",
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    return {
        success: true,
        message: "User Banned",
        status_code: StatusCodes.OK,
    };
};

const fetch_users = async (filters, query, collection) => {
    let { search, page = 1, limit = 10 } = filters;
    page = toNumber(page, 1);
    limit = toNumber(limit, 10);

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { body: { $regex: search, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;

    const response = await collection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

    const passwordLessResponse = response.map(
        ({ password, ...userInfo }) => userInfo
    );

    const totalCount = await collection.countDocuments(query);
    const pagination = {
        has_next_page: totalCount > skip + response.length,
        current_page: page,
        current_count: response.length,
        total_count: totalCount,
        limit,
    };

    return {
        success: true,
        message: "Users Fetched",
        pagination,
        data: passwordLessResponse,
        status_code: StatusCodes.OK,
    };
};

const fetch_reports = async (targetType, filters, collection) => {
    let { page = 1, limit = 10 } = filters;
    page = toNumber(page, 1);
    limit = toNumber(limit, 10);

    const skip = (page - 1) * limit;

    const response = await collection
        .find({ targetType })
        .skip(skip)
        .limit(limit)
        .toArray();

    const totalCount = await collection.countDocuments({ targetType });

    const pagination = {
        has_next_page: totalCount > skip + response.length,
        current_page: page,
        current_count: response.length,
        total_count: totalCount,
        limit,
    };

    return {
        success: true,
        message: "Data Fetched",
        pagination,
        data: response,
        status_code: StatusCodes.OK,
    };
};

export default {
    fetch_stats,
    change_user_status,
    change_user_role,
    fetch_users,
    fetch_reports,
};
