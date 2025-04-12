import { StatusCodes } from "http-status-codes";

const get_specific = async (username, user_collection, posts_collection) => {
    const targetUser = await user_collection.findOne({ username });
    if (!targetUser) {
        return {
            success: false,
            message: "User not Found!",
            query: {
                id: username,
            },
            status_code: StatusCodes.NOT_FOUND,
        };
    }

    const { password, email, ...userInfo } = targetUser;

    const userPosts = await posts_collection
        .find({ authorId: username })
        .toArray();

    return {
        success: true,
        message: "User info Fetched",
        ...userInfo,
        posts: userPosts,
        status_code: StatusCodes.OK,
    };
};

const fetch_posts = async (username, collection) => {
    const response = await collection.find({ authorId: username }).toArray();

    return {
        success: true,
        message: "Posts Fetched",
        posts: response,
        status_code: StatusCodes.OK,
    };
};

export default { get_specific, fetch_posts };
