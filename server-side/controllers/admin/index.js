import { StatusCodes } from "http-status-codes";

const fetch_stats = async (
    usersCollection,
    postsCollection,
    commentsCollection,
    subhiroCollection
) => {
    const totalUsers = await usersCollection.estimatedDocumentCount();
    const totalPosts = await postsCollection.estimatedDocumentCount();
    const totalComments = await commentsCollection.estimatedDocumentCount();
    const totalSubhiro = await subhiroCollection.estimatedDocumentCount();

    const mostUpvotedPosts = await collection
        .aggregate([
            {
                $addFields: {
                    upvoteCount: { $size: "$upvotedBy" },
                },
            },
            { $sort: { upvoteCount: -1 } },
            { $limit: 3 },
        ])
        .toArray();

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const newUsersThisWeek = await usersCollection.countDocuments({
        createdAt: { $gte: startOfWeek },
    });

    const newPostsThisWeek = await postsCollection.countDocuments({
        createdAt: { $gte: startOfWeek },
    });

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
        most_upvoted: mostUpvotedPosts,
        status_code: StatusCodes.OK,
    };

    return response;
};

const change_user_status = async (user, targetId, status, collection) => {
    const doc = {
        status,
    };

    if (status === "ban") {
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
    const { search, page = 1, limit = 10 } = filters;

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

export default {
    fetch_stats,
    change_user_status,
    change_user_role,
    fetch_users,
};
