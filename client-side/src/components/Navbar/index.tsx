"use client";

import React from "react";
import { RiMenuLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { LuMessageCircleMore } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Button from "../Button";

const Navbar = ({
    setDrawerOpened,
}: {
    setDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <header className="px-3 py-1.5 flex justify-between items-center gap-4 border-b border-neutral-300">
            {/* Logo and Menu */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={(e) => {
                        setDrawerOpened((prev) => !prev);
                    }}
                >
                    <RiMenuLine className="text-2xl" />
                </Button>

                <a href="/" className="flex gap-1.5 items-center">
                    <img
                        src="/icons/logo.png"
                        alt="Logo"
                        className="rounded-full w-9"
                    />
                    <p className="text-primary font-semibold text-2xl hidden lg:inline">
                        hirobee
                    </p>
                </a>
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
                <Button className="hidden sm:block">
                    <LuMessageCircleMore className="text-2xl" />
                </Button>
                <Button>
                    <FiPlus className="text-2xl" />
                    <span className="text-sm font-medium px-0.5 hidden sm:inline">
                        Create
                    </span>
                </Button>

                <Button className="hidden sm:block">
                    <IoMdNotificationsOutline className="text-2xl" />
                </Button>

                <Button className="!p-1">
                    <img
                        src="https://i.ibb.co.com/Dfp53bmp/user-avatar.png"
                        alt="Profile Picture"
                        className="w-10 rounded-full"
                    />
                </Button>
            </div>
        </header>
    );
};

export default Navbar;
