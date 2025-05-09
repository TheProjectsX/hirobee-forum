export const userRegisterValidator = (
    body,
    minUsernameLength = 4,
    minPassLength = 6
) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = new RegExp(`^.{${minUsernameLength},}$`);
    const passwordRegex = new RegExp(`^.{${minPassLength},}$`);

    if (!body || typeof body !== "object") return false;

    const { email, username, password } = body;

    const isEmailValid = emailRegex.test(email);
    const isUsernameValid = usernameRegex.test(username);
    const isPasswordValid = passwordRegex.test(password);

    return isEmailValid && isUsernameValid && isPasswordValid;
};

export const userInfoUpdateFilter = (body) => {
    if (!body) return {};
    const approved_keys = [
        "displayname",
        "profile_picture",
        "banner",
        "gender",
        "bio",
    ];

    const filteredBody = approved_keys.reduce((acc, key) => {
        if (key in body) acc[key] = body[key];
        return acc;
    }, {});

    return filteredBody;
};

export const postCreateFilter = (body) => {
    if (!body) return {};
    const approved_keys = ["title", "content", "images", "subhiro"];

    const filteredBody = approved_keys.reduce((acc, key) => {
        if (key in body) acc[key] = body[key];
        return acc;
    }, {});

    return filteredBody;
};

export const postCreateValidator = (body) => {
    const required_keys = ["title"];
    const minLength = 5;

    if (!body || typeof body !== "object") return false;

    if (typeof body.title !== "string" || body.title.length < minLength) {
        return false;
    }

    return required_keys.every((key) => key in body);
};

export const postUpdateFilter = (body) => {
    if (!body) return {};
    const approved_keys = ["title", "content", "subhiro"];

    const filteredBody = approved_keys.reduce((acc, key) => {
        if (key in body) acc[key] = body[key];
        return acc;
    }, {});

    return filteredBody;
};

export const subhiroCreateFilter = (body) => {
    if (!body) return {};
    const approved_keys = [
        "displayname",
        "hironame",
        "description",
        "rules",
        "profile_picture",
        "banner",
    ];

    const filteredBody = approved_keys.reduce((acc, key) => {
        if (key in body) acc[key] = body[key];
        return acc;
    }, {});

    return filteredBody;
};

export const subhiroCreateValidator = (body) => {
    const required_keys = [
        "displayname",
        "hironame",
        "description",
        "rules",
        "profile_picture",
    ];
    const minLength = 5;

    if (!body || typeof body !== "object") {
        return false;
    }
    if (
        typeof body.displayname !== "string" ||
        body.displayname.length < minLength ||
        typeof body.hironame !== "string" ||
        body.hironame.length < minLength ||
        typeof body.description !== "string" ||
        body.description.length < minLength ||
        typeof body.profile_picture !== "string"
    ) {
        return false;
    }

    return required_keys.every((key) => key in body);
};

export const subhiroUpdateFilter = (body) => {
    if (!body) return {};
    const approved_keys = [
        "displayname",
        "description",
        "rules",
        "profile_picture",
        "banner",
    ];

    const filteredBody = approved_keys.reduce((acc, key) => {
        if (key in body) acc[key] = body[key];
        return acc;
    }, {});

    return filteredBody;
};
