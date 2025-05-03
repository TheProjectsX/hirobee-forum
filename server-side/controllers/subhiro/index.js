import { StatusCodes } from "http-status-codes";
import {
    subhiroCreateFilter,
    subhiroCreateValidator,
} from "../../utils/validators.js";
import {
    postAggregationPipeline,
    subhiroAggregationPipeline,
} from "../../utils/variables.js";
import { toNumber } from "../../utils/helpers.js";

const search_subhiro = async (filters, collection) => {
    const { query: search, limit = 5 } = filters;
    const query = {};

    if (search) {
        query.$or = [{ hironame: { $regex: search, $options: "i" } }];
    }

    const response = await collection.find(query).limit(limit).toArray();

    return {
        success: true,
        message: "SubHiro Searched",
        data: response,
        status_code: StatusCodes.OK,
    };
};

const fetch_details = async (subhiroId, collection) => {
    const response = await collection
        .aggregate([
            {
                $match: {
                    hironame: { $regex: `^${subhiroId}$`, $options: "i" },
                },
            },
            ...subhiroAggregationPipeline,
            {
                $limit: 1,
            },
        ])
        .toArray();

    if (response.length === 0) {
        return {
            success: false,
            message: "SubHiro not Found",
            query: {
                id: subhiroId,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    return {
        success: true,
        message: "Fetched SubHiro",
        ...response[0],
        status_code: StatusCodes.OK,
    };
};

const fetch_posts = async (subhiroId, filters, collection) => {
    let { page = 1, limit = 10 } = filters;
    page = toNumber(page, 1);
    limit = toNumber(limit, 1);

    const skip = (page - 1) * limit;

    const response = await collection
        .aggregate([
            {
                $match: {
                    subhiro: { $regex: `^${subhiroId}$`, $options: "i" },
                },
            },
            ...postAggregationPipeline,
            { $skip: skip },
            { $limit: Number(limit) },
        ])
        .toArray();

    const totalCount = await collection.countDocuments({ subhiro: subhiroId });

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

const create_subhiro = async (user, body, collection) => {
    const filteredBody = subhiroCreateFilter(body);

    if (!subhiroCreateValidator(filteredBody)) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const doc = {
        creator: user.username,
        ...filteredBody,
        moderators: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    const response = await collection.insertOne(doc);
    if (!response.acknowledged) {
        return {
            success: false,
            message: "Failed to Create SubHiro",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }

    return {
        success: true,
        message: "SubHiro Created",
        id: filteredBody.hironame,
        status_code: StatusCodes.CREATED,
    };
};

export default { fetch_details, fetch_posts, create_subhiro, search_subhiro };
