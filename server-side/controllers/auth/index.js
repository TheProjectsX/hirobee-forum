import { StatusCodes } from "http-status-codes";
import { userRegisterValidator } from "../../utils/validators.js";
import bcrypt from "bcrypt";

const register = async (body, collection) => {
    if (!userRegisterValidator(body)) {
        return {
            success: false,
            message: "Invalid Body provided",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    // Check if Username || Email already Exists

    const usernameExists = await collection.findOne({
        username: body.username,
    });

    if (usernameExists) {
        return {
            success: false,
            message: "Username Already Exists!",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    const emailExists = await collection.findOne({ email: body.email });

    if (emailExists) {
        return {
            success: false,
            message: "Email Already Exists!",
            status_code: StatusCodes.BAD_REQUEST,
        };
    }

    // Add user to DB

    const hashedPassword = bcrypt.hashSync(String(body.password), 10);

    const userInfo = {
        username: body.username,
        displayname: body.username,
        email: body.email,
        profile_picture: "https://i.ibb.co.com/Dfp53bmp/user-avatar.png",
        banner: null,
        bio: null,
        gender: null,
        role: "author",
        status: "active",
        meta: {},
        password: hashedPassword,
        createdAt: Date.now(),
    };

    const response = await collection.insertOne(userInfo);
    if (response.acknowledged) {
        return {
            success: true,
            message: "User Created Successfully!",
            status_code: StatusCodes.CREATED,
        };
    } else {
        return {
            success: false,
            message: "Failed to Create User",
            status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }
};

const login = async (body, collection) => {
    if (!body?.email || !body?.password) {
        return {
            success: false,
            message: "Invalid Credentials",
            status_code: StatusCodes.UNAUTHORIZED,
        };
    }

    const targetUser = await collection.findOne({
        $or: [{ username: body.email }, { email: body.email }],
    });
    if (!targetUser) {
        return {
            success: false,
            message: "Invalid Credentials",
            status_code: StatusCodes.UNAUTHORIZED,
        };
    }

    const { password: hashedPassword, ...userInfo } = targetUser;

    const authorized = bcrypt.compareSync(
        String(body.password),
        hashedPassword
    );
    if (!authorized) {
        return {
            success: false,
            message: "Invalid Credentials",
            status_code: StatusCodes.UNAUTHORIZED,
        };
    }

    return {
        success: true,
        status_code: StatusCodes.OK,
        message: "Login Successful!",
        username: userInfo.username,
    };
};

export default { register, login };
