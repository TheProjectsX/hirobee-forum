import { StatusCodes } from "http-status-codes";

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

export default { fetch_details, fetch_posts };
