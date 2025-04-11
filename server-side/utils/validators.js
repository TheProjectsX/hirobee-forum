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
