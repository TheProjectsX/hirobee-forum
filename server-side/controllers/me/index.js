import { StatusCodes } from "http-status-codes";
import {
    postCreateFilter,
    postCreateValidator,
    postUpdateFilter,
    userInfoUpdateFilter,
} from "../../utils/validators.js";
import { ObjectId } from "mongodb";
import { postAggregationPipeline } from "../../utils/variables.js";
import { toNumber } from "../../utils/helpers.js";

const fetch_info = async (user, collection) => {
    const { email } = user;

    const targetUser = await collection.findOne({ email });
    if (!targetUser) {
        return {
            success: false,
            message: "Unauthorized Request",
            status_code: StatusCodes.UNAUTHORIZED,
        };
    }

    const { password, ...userInfo } = targetUser;

    return {
        success: true,
        status_code: StatusCodes.OK,
        ...userInfo,
    };
};

const update_info = async (user, body, collection) => {
    const filteredBody = userInfoUpdateFilter({ ...body });
    if (Object.keys(filteredBody).length === 0) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const response = await collection.updateOne(
        { email: user.email },
        {
            $set: filteredBody,
        }
    );

    return {
        success: true,
        message: "User Info updated",
        status_code: StatusCodes.OK,
    };
};

const fetch_posts = async (user, filters, collection) => {
    let { search, page = 1, limit = 10, subhiro, sortBy = "new" } = filters;
    page = toNumber(page, 1);
    limit = toNumber(limit, 10);

    const query = {
        authorId: user.username,
    };
    const sort = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { body: { $regex: search, $options: "i" } },
        ];
    }

    if (subhiro) query.subhiro = subhiro;

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
        message: "Posts Fetched",
        status_code: StatusCodes.OK,
        pagination,
        data: response,
    };
};

const fetch_single_post = async (user, postId, collection) => {
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

    const response = await collection
        .aggregate([
            {
                $match: {
                    authorId: user.username,
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

    return {
        success: true,
        message: "Post fetched",
        status_code: StatusCodes.OK,
        ...response[0],
    };
};

const create_post = async (user, body, collection) => {
    const filteredBody = postCreateFilter(body);
    if (!postCreateValidator(filteredBody)) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const postBody = {
        title: filteredBody.title,
        content: filteredBody.content,
        authorId: user.username,
        subhiroId: filteredBody.subhiro ?? null,
        upvotedBy: [],
        downvotedBy: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    const response = await collection.insertOne(postBody);

    if (response.acknowledged) {
        return {
            success: true,
            message: "Post Created!",
            id: response.insertedId,
            status_code: StatusCodes.CREATED,
        };
    } else {
        return {
            success: false,
            message: "Failed to Create Post",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }
};

const update_post = async (user, postId, body, collection) => {
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

    const filteredBody = postUpdateFilter(body);
    if (Object.keys(filteredBody).length === 0) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const response = await collection.updateOne(
        {
            authorId: user.username,
            _id: postOid,
        },
        {
            $set: { ...filteredBody, updatedAt: Date.now() },
        }
    );

    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }
    return {
        success: true,
        message: "Post Updated",
        id: postId,
        status_code: StatusCodes.OK,
    };
};

const delete_post = async (user, postId, collection) => {
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

    const response = await collection.deleteOne({
        authorId: user.username,
        _id: postOid,
    });

    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }
    return {
        success: true,
        message: "Post Deleted",
        status_code: StatusCodes.OK,
    };
};

const join_subhiro = async (
    user,
    subhiroId,
    usersCollection,
    subhiroCollection
) => {
    const targetSubhiro = await subhiroCollection.findOne({
        hironame: subhiroId,
    });
    if (!targetSubhiro) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const response = await usersCollection.updateOne(
        { username: user.username },
        { $addToSet: { joinedSubhiros: subhiroId } }
    );

    if (response.modifiedCount === 0) {
        return {
            success: false,
            message: "Already Joined!",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    return {
        success: true,
        message: "Joined SubHiro",
        status_code: StatusCodes.OK,
    };
};

const leave_subhiro = async (user, subhiroId, collection) => {
    const response = await collection.updateOne(
        { username: user.username },
        { $pull: { joinedSubhiros: subhiroId } }
    );

    if (response.modifiedCount === 0) {
        return {
            success: false,
            message: "You are not joined Yet!",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    return {
        success: true,
        message: "Left SubHiro",
        status_code: StatusCodes.OK,
    };
};

export default {
    fetch_info,
    update_info,
    fetch_posts,
    fetch_single_post,
    create_post,
    update_post,
    delete_post,
    join_subhiro,
    leave_subhiro,
};
