import { StatusCodes } from "http-status-codes";
import {
    subhiroCreateFilter,
    subhiroCreateValidator,
} from "../../utils/validators";

const fetch_details = async (subhiroId, collection) => {
    const response = await collection.findOne({ hironame: subhiroId });

    if (!response) {
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
        ...response,
        status_code: StatusCodes.OK,
    };
};

const fetch_posts = async (subhiroId, filters, collection) => {
    const { page = 1, limit = 10 } = filters;

    const skip = page * limit;

    const response = await collection
        .find({ subhiro: subhiroId })
        .skip(skip)
        .limit(limit)
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

export default { fetch_details, fetch_posts, create_subhiro };
