import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import {
    commentAggregationPipeline,
    postAggregationPipeline,
} from "../../utils/variables.js";

const fetch_posts = async (filters, collection) => {
    const {
        query: search,
        page = 1,
        limit = 10,
        subhiro,
        author,
        sortBy = "new",
    } = filters;

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
            { $limit: limit },
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

const fetch_single_post = async (postId, collection) => {
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

const update_vote = async (user, postId, meta, collection) => {
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

    const doc = {};

    doc[meta.action === "add" ? "$addToSet" : "$pull"] = {
        [meta.target === "upvote" ? "upvotedBy" : "downvotedBy"]: user.username,
    };

    const response = await collection.updateOne({ _id: postOid }, doc);

    if (response.matchedCount === 0) {
        return {
            success: false,
            message: "Post not Found!",
            query: {
                id: postId,
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

const fetch_comments = async (postId, filters, collection) => {
    const { page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const response = await collection

        .aggregate([
            { $match: { postId } },
            ...commentAggregationPipeline,
            { $skip: skip },
            { $limit: limit },
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

export default {
    fetch_posts,
    fetch_single_post,
    update_vote,
    fetch_comments,
};
