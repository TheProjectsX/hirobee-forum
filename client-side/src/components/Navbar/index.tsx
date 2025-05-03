"use client";

import React, { useEffect } from "react";
import RoundedButton from "@/components/Buttons/Rounded";
import Link from "next/link";
import Popover from "../Popover";
import SquareButton from "../Buttons/Square";

import { RiMenuLine } from "react-icons/ri";
import { IoSearchOutline, IoTrophyOutline } from "react-icons/io5";
import { LuMessageCircleMore } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgDarkMode, CgProfile } from "react-icons/cg";
import { TbMoodEdit } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import { GoGear, GoMegaphone } from "react-icons/go";
import { GrUserAdmin } from "react-icons/gr";
import { useLogoutMutation } from "@/store/features/auth/authApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    setAuthModalType,
    setDrawerOpened,
    SiteConfigState,
} from "@/store/features/config/configSlice";
import {
    fetchUserInfoViaThunk,
    removeUserInfo,
    userInfoType,
} from "@/store/features/user/userInfoSlice";
import { AppDispatch } from "@/store/app/store";

const Navbar = () => {
    const {
        data: userInfo,
        isLoading,
        isSuccess,
        isError,
    }: userInfoType = useSelector((state: any) => state.user_info);
    const dispatch = useDispatch<AppDispatch>();

    const [logoutUser] = useLogoutMutation();

    const siteConfig: SiteConfigState = useSelector(
        (state: any) => state.site_config
    );

    // Logout User
    const handleLogoutUser = async () => {
        try {
            await logoutUser({}).unwrap();
            dispatch(removeUserInfo());
            toast.success("Logout Successful!");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Logout Failed");
        }
    };

    // Dispatch Async Thunk to Load Data
    useEffect(() => {
        dispatch(fetchUserInfoViaThunk());
    }, [dispatch]);

    return (
        <header className="sticky top-0 px-3 py-1.5 flex justify-between items-center gap-4 border-b border-neutral-300 z-[100] bg-white">
            {/* Logo and Menu */}
            <div className="flex items-center gap-2">
                <RoundedButton
                    className="lg:hidden"
                    onClick={(e) => {
                        dispatch(setDrawerOpened(!siteConfig.drawerOpened));
                    }}
                >
                    <RiMenuLine className="text-2xl" />
                </RoundedButton>

                <Link href="/" className="flex gap-1.5 items-center">
                    <img
                        src="/icons/logo.png"
                        alt="Logo"
                        className="rounded-full w-9"
                    />
                    <p className="text-primary font-semibold text-2xl hidden lg:inline">
                        hirobee
                    </p>
                </Link>
            </div>

            {/* Search */}
            <div className="flex-1 lg:max-w-lg">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div
                        className="bg-slate-200 hover:bg-slate-300 flex items-center gap-2 rounded-full px-3 py-2 cursor-text border-2 border-slate-200 hover:border-slate-300 has-[input:focus]:border-primary"
                        onClick={(e) => {
                            const target = e.target as HTMLElement;
                            target.querySelector("input")?.focus();
                        }}
                    >
                        <span className="text-gray-600 text-xl">
                            <IoSearchOutline />
                        </span>
                        <input
                            type="text"
                            className="border-none outline-none text-sm w-full"
                            placeholder="Search Hirobee"
                        />
                    </div>
                </form>
            </div>

            {/* Extra */}
            <div className="flex items-center gap-0.5">
                {/* Auth (Login / Register) */}
                {!isLoading && (!userInfo || isError) && (
                    <RoundedButton
                        className="!bg-blue-600 hover:!bg-blue-500"
                        onClick={() => dispatch(setAuthModalType("login"))}
                    >
                        <span className="px-2 text-sm text-white font-semibold">
                            Login
                        </span>
                    </RoundedButton>
                )}

                {/* User Profile */}
                {isSuccess && (
                    <>
                        <RoundedButton className="hidden sm:block">
                            <LuMessageCircleMore className="text-2xl" />
                        </RoundedButton>
                        <Link href={"/posts/submit"}>
                            <RoundedButton>
                                <FiPlus className="text-2xl" />
                                <span className="text-sm font-medium px-0.5 hidden sm:inline">
                                    Create
                                </span>
                            </RoundedButton>
                        </Link>

                        <RoundedButton className="hidden sm:block">
                            <IoMdNotificationsOutline className="text-2xl" />
                        </RoundedButton>
                        <Popover
                            position="bottom"
                            axis="right"
                            className="rounded-xl"
                            indicator={false}
                            content={
                                <div className="py-2 min-w-60">
                                    <Link href={`/user/${userInfo.username}`}>
                                        <SquareButton
                                            className="w-full !py-2 gap-3"
                                            Icon={CgProfile}
                                            iconClassName="!text-2xl"
                                        >
                                            <span className="flex flex-col">
                                                <span className="text-slate-700">
                                                    Visit Profile
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    u/{userInfo.username}
                                                </span>
                                            </span>
                                        </SquareButton>
                                    </Link>

                                    <SquareButton
                                        className="w-full !py-4 gap-3"
                                        Icon={TbMoodEdit}
                                        iconClassName="!text-2xl"
                                    >
                                        <span className="text-slate-700">
                                            Edit Avatar
                                        </span>
                                    </SquareButton>
                                    <SquareButton
                                        className="w-full !py-4 gap-3"
                                        Icon={IoTrophyOutline}
                                        iconClassName="!text-2xl"
                                    >
                                        <span className="text-slate-700">
                                            Achievements
                                        </span>
                                    </SquareButton>
                                    <SquareButton
                                        className="w-full !py-4 gap-3"
                                        Icon={CgDarkMode}
                                        iconClassName="!text-2xl"
                                    >
                                        <span className="text-slate-700">
                                            Dark Mode
                                        </span>
                                    </SquareButton>
                                    <SquareButton
                                        className="w-full !py-4 gap-3"
                                        Icon={MdLogout}
                                        onClick={handleLogoutUser}
                                        iconClassName="!text-2xl"
                                    >
                                        <span className="text-slate-700">
                                            Logout
                                        </span>
                                    </SquareButton>

                                    {userInfo.role === "admin" && (
                                        <>
                                            <div className="pb-2 mb-2 mx-2 border-b border-neutral-300"></div>
                                            <Link href={"/admin"}>
                                                <SquareButton
                                                    className="w-full !py-4 gap-3"
                                                    Icon={GrUserAdmin}
                                                    iconClassName="!text-2xl"
                                                >
                                                    <span className="text-slate-700">
                                                        Admin Dashboard
                                                    </span>
                                                </SquareButton>
                                            </Link>
                                        </>
                                    )}

                                    <div className="pb-2 mb-2 mx-2 border-b border-neutral-300"></div>
                                    <Link href={"#"}>
                                        <SquareButton
                                            className="w-full !py-4 gap-3"
                                            Icon={GoMegaphone}
                                            iconClassName="!text-2xl"
                                        >
                                            <span className="text-slate-700">
                                                Advertise on Hirobee
                                            </span>
                                        </SquareButton>
                                    </Link>

                                    <div className="pb-2 mb-2 mx-2 border-b border-neutral-300"></div>
                                    <Link href={"/settings"}>
                                        <SquareButton
                                            className="w-full !py-4 gap-3"
                                            Icon={GoGear}
                                            iconClassName="!text-2xl"
                                        >
                                            <span className="text-slate-700">
                                                Settings
                                            </span>
                                        </SquareButton>
                                    </Link>
                                </div>
                            }
                        >
                            <RoundedButton
                                className="!p-0"
                                title={userInfo.displayname}
                            >
                                <img
                                    src={userInfo.profile_picture}
                                    alt="Profile Picture"
                                    className="w-10 rounded-full"
                                />
                            </RoundedButton>
                        </Popover>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
