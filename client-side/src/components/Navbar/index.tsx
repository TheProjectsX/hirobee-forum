"use client";

import React from "react";
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

const Navbar = ({
    setDrawerOpened,
}: {
    setDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <header className="px-3 py-1.5 flex justify-between items-center gap-4 border-b border-neutral-300">
            {/* Logo and Menu */}
            <div className="flex items-center gap-2">
                <RoundedButton
                    className="lg:hidden"
                    onClick={(e) => {
                        setDrawerOpened((prev) => !prev);
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

                {/* User Profile */}
                <Popover
                    position="bottom"
                    axis="right"
                    className="rounded-xl"
                    indicator={false}
                    content={
                        <div className="py-2 min-w-60">
                            <Link href={"/me"}>
                                <SquareButton
                                    className="w-full !py-4"
                                    Icon={CgProfile}
                                >
                                    <span className="text-slate-700">
                                        Visit Profile
                                    </span>
                                </SquareButton>
                            </Link>

                            <SquareButton
                                className="w-full !py-4"
                                Icon={TbMoodEdit}
                            >
                                <span className="text-slate-700">
                                    Edit Avatar
                                </span>
                            </SquareButton>
                            <SquareButton
                                className="w-full !py-4"
                                Icon={IoTrophyOutline}
                            >
                                <span className="text-slate-700">
                                    Achievements
                                </span>
                            </SquareButton>
                            <SquareButton
                                className="w-full !py-4"
                                Icon={CgDarkMode}
                            >
                                <span className="text-slate-700">
                                    Dark Mode
                                </span>
                            </SquareButton>
                            <SquareButton
                                className="w-full !py-4"
                                Icon={MdLogout}
                            >
                                <span className="text-slate-700">Logout</span>
                            </SquareButton>

                            <div className="pb-2 mb-2 mx-2 border-b border-neutral-300"></div>

                            <Link href={"/admin"}>
                                <SquareButton
                                    className="w-full !py-4"
                                    Icon={GrUserAdmin}
                                >
                                    <span className="text-slate-700">
                                        Admin Dashboard
                                    </span>
                                </SquareButton>
                            </Link>

                            <div className="pb-2 mb-2 mx-2 border-b border-neutral-300"></div>
                            <Link href={"#"}>
                                <SquareButton
                                    className="w-full !py-4"
                                    Icon={GoMegaphone}
                                >
                                    <span className="text-slate-700">
                                        Advertise on Hirobee
                                    </span>
                                </SquareButton>
                            </Link>

                            <div className="pb-2 mb-2 mx-2 border-b border-neutral-300"></div>
                            <Link href={"#"}>
                                <SquareButton
                                    className="w-full !py-4"
                                    Icon={GoGear}
                                >
                                    <span className="text-slate-700">
                                        Settings
                                    </span>
                                </SquareButton>
                            </Link>
                        </div>
                    }
                >
                    <RoundedButton className="!p-1">
                        <img
                            src="https://i.ibb.co.com/Dfp53bmp/user-avatar.png"
                            alt="Profile Picture"
                            className="w-10 rounded-full"
                        />
                    </RoundedButton>
                </Popover>
            </div>
        </header>
    );
};

export default Navbar;
