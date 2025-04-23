"use client";

import { Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import React, { useState } from "react";
import RoundedButton from "../Buttons/Rounded";
import Link from "next/link";
import { toast } from "react-toastify";
import {
    useLoginMutation,
    useRegisterMutation,
} from "@/store/features/auth/authApiSlice";
import { useFetchUserInfoQuery } from "@/store/features/userInfo/userInfoApiSlice";

const Auth = () => {
    // Mutations

    const [
        registerUser,
        { isLoading: isRegisterLoading, isSuccess: isRegisterSuccess },
    ] = useRegisterMutation();

    const [
        loginUser,
        { isLoading: isLoginLoading, isSuccess: isLoginSuccess },
    ] = useLoginMutation();

    const { refetch: fetchUserInfo, isSuccess: isFetchUserInfoSuccess } =
        useFetchUserInfoQuery({});

    const [modalType, setModalType] = useState<
        "close" | "login" | "register" | "registration_complete"
    >("close");

    const [authValues, setAuthValues] = useState<{
        email: string;
        username: string;
        password: string;
    }>({ email: "", username: "", password: "" });

    // TODO: Handle Register
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const credentials = {
            email: authValues.email,
            username: authValues.username,
            password: authValues.password,
        };

        // Check if Credentials Criteria does not match before sending request
        if (
            !credentials.email ||
            credentials.email?.length < 5 ||
            !credentials.username ||
            credentials.username?.length < 5 ||
            !credentials.password ||
            credentials.password?.length < 6
        ) {
            toast.error("Bad Request. Recheck Your Input Data", {
                autoClose: 3500,
            });
            return;
        }

        // Send Request
        try {
            const registerResponse = await registerUser(credentials).unwrap();
            toast.success("Registration SuccessFul!");
            setModalType("close");

            const userInfoResponse = await fetchUserInfo().unwrap();
            // Do other stuffs
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Invalid Credentials");
        }
    };

    // Handle Login
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const credentials = {
            email: authValues.email,
            password: authValues.password,
        };

        // Check if Credentials Criteria does not match before sending request
        if (
            !credentials.email ||
            credentials.email?.length < 5 ||
            !credentials.password ||
            credentials.password?.length < 6
        ) {
            toast.error("Invalid Credentials");
            return;
        }

        // Send Request
        try {
            const loginResponse = await loginUser(credentials).unwrap();
            toast.success("Login SuccessFul!");
            setModalType("close");

            const userInfoResponse = await fetchUserInfo().unwrap();
            // Do other stuffs
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Invalid Credentials");
        }
    };

    return (
        <>
            <RoundedButton
                className="!bg-blue-600 hover:!bg-blue-500"
                onClick={() => setModalType("login")}
            >
                <span className="px-2 text-sm text-white font-semibold">
                    Login
                </span>
            </RoundedButton>
            <Modal
                show={modalType !== "close"}
                onClose={() => setModalType("close")}
                size="lg"
                popup
                dismissible
            >
                <ModalHeader className="!pb-0" />
                <ModalBody>
                    {modalType === "login" && (
                        <div className="px-4 sm:max-w-96 mx-auto">
                            <h3 className="text-2xl font-semibold text-center mb-2 underline underline-offset-4">
                                Log In
                            </h3>
                            <p className="text-sm mb-6 text-center">
                                By continuing, you agree to our{" "}
                                <Link
                                    href={"#"}
                                    className="text-blue-500 hover:underline"
                                >
                                    User Agreement
                                </Link>{" "}
                                and acknowledge that you understand the{" "}
                                <Link
                                    href={"#"}
                                    className="text-blue-500 hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>

                            <form onSubmit={handleLogin}>
                                <input
                                    type="text"
                                    value={authValues.email}
                                    onChange={(e) =>
                                        setAuthValues((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter Username or Email"
                                    className="w-full rounded-3xl px-5 py-2.5 bg-slate-100 text-sm focus:outline-[dodgerBlue] mb-4"
                                    required
                                />
                                <input
                                    type="password"
                                    value={authValues.password}
                                    onChange={(e) =>
                                        setAuthValues((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter your Password"
                                    className="w-full rounded-3xl px-5 py-2.5 bg-slate-100 text-sm focus:outline-[dodgerBlue] mb-4"
                                    required
                                />

                                <p className="text-blue-600 text-sm hover:underline underline-offset-4 cursor-pointer mb-1.5">
                                    Forgot Password? IDC, Live with it!
                                </p>

                                <p className="text-sm mb-6">
                                    No Account?{" "}
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:underline underline-offset-4 px-1"
                                        onClick={(e) =>
                                            setModalType("register")
                                        }
                                    >
                                        Join ASAP!
                                    </button>
                                </p>

                                <RoundedButton
                                    className={`!bg-blue-600 w-full justify-center ${
                                        isLoginLoading
                                            ? "!cursor-progress hover:!bg-blue-600"
                                            : "hover:!bg-blue-500"
                                    } ${
                                        isLoginSuccess
                                            ? "!cursor-not-allowed hover:!bg-blue-600"
                                            : "hover:!bg-blue-500"
                                    }`}
                                    disabled={
                                        (isLoginLoading || isLoginSuccess) &&
                                        isFetchUserInfoSuccess
                                    }
                                    type="submit"
                                >
                                    {!isLoginLoading && !isLoginSuccess && (
                                        <span className="px-2 py-0.5 text-sm text-white font-semibold">
                                            Login
                                        </span>
                                    )}

                                    {isLoginSuccess && (
                                        <span className="px-2 text-sm text-white font-semibold">
                                            Login Successful!
                                        </span>
                                    )}

                                    {isLoginLoading && (
                                        <Spinner size="sm" light />
                                    )}
                                </RoundedButton>
                            </form>
                        </div>
                    )}

                    {modalType === "register" && (
                        <div className="px-4 sm:max-w-96 mx-auto">
                            <h3 className="text-2xl font-semibold text-center mb-2 underline underline-offset-4">
                                Register
                            </h3>
                            <p className="text-sm mb-6 text-center">
                                By continuing, you agree to our{" "}
                                <Link
                                    href={"#"}
                                    className="text-blue-500 hover:underline"
                                >
                                    User Agreement
                                </Link>{" "}
                                and acknowledge that you understand the{" "}
                                <Link
                                    href={"#"}
                                    className="text-blue-500 hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>

                            <form onSubmit={handleRegister}>
                                <input
                                    type="text"
                                    value={authValues.username}
                                    onChange={(e) =>
                                        setAuthValues((prev) => ({
                                            ...prev,
                                            username: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter Username"
                                    className="w-full rounded-3xl px-5 py-2.5 bg-slate-100 text-sm focus:outline-[dodgerBlue] mb-4"
                                    minLength={5}
                                    required
                                />
                                <input
                                    type="email"
                                    value={authValues.email}
                                    onChange={(e) =>
                                        setAuthValues((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter Email"
                                    className="w-full rounded-3xl px-5 py-2.5 bg-slate-100 text-sm focus:outline-[dodgerBlue] mb-4"
                                    required
                                />
                                <input
                                    type="password"
                                    value={authValues.password}
                                    onChange={(e) =>
                                        setAuthValues((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter your Password"
                                    className="w-full rounded-3xl px-5 py-2.5 bg-slate-100 text-sm focus:outline-[dodgerBlue] mb-4"
                                    minLength={6}
                                    required
                                />

                                <p className="text-sm mb-6">
                                    Already Registered?
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:underline underline-offset-4 px-2"
                                        onClick={(e) => setModalType("login")}
                                    >
                                        Welcome Back!
                                    </button>
                                </p>

                                <RoundedButton
                                    className={`!bg-blue-600 w-full justify-center ${
                                        isRegisterLoading
                                            ? "!cursor-progress hover:!bg-blue-600"
                                            : "hover:!bg-blue-500"
                                    } ${
                                        isRegisterSuccess
                                            ? "!cursor-not-allowed hover:!bg-blue-600"
                                            : "hover:!bg-blue-500"
                                    }`}
                                    disabled={
                                        (isRegisterLoading ||
                                            isRegisterSuccess) &&
                                        isFetchUserInfoSuccess
                                    }
                                    type="submit"
                                >
                                    {!isRegisterLoading &&
                                        !isRegisterSuccess && (
                                            <span className="px-2 py-0.5 text-sm text-white font-semibold">
                                                Register
                                            </span>
                                        )}

                                    {isRegisterSuccess && (
                                        <span className="px-2 text-sm text-white font-semibold">
                                            Registration Successful!
                                        </span>
                                    )}

                                    {isRegisterLoading && (
                                        <Spinner size="sm" light />
                                    )}
                                </RoundedButton>
                            </form>
                        </div>
                    )}
                </ModalBody>
            </Modal>
        </>
    );
};

export default Auth;
