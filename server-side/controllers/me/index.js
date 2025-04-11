import { StatusCodes } from "http-status-codes";
import { userInfoUpdateFilter } from "../../utils/validators.js";

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
        status_code: StatusCodes.OK,
        ...response,
    };
};

export default { fetch_info, update_info };
