import React from "react";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import Footer from "@/components/Footer";
import Popover from "@/components/Popover";
import SquareButton from "@/components/Buttons/Square";
import RoundedButton from "@/components/Buttons/Rounded";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoFlagOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { LiaUserAltSlashSolid } from "react-icons/lia";
import { TbShare3 } from "react-icons/tb";
import { notFound } from "next/navigation";
import { ShortNumber } from "@lytieuphong/short-number";

import Link from "next/link";

interface UserDataInterface {
    _id: string;
    username: string;
    displayname: string;
    profile_picture: string;
    banner: string | null;
    status: "active" | "banned";
    role: "author" | "admin" | "moderator";
    gender: string | null;
    bio: string | null;
    createdAt: number;
    postsCount: number;
    commentsCount: number;
}

const UserLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ username: string }>;
}) => {
    const { username } = await params;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${username}`
    );
    if (response.status !== 200) {
        return notFound();
    }

    const userData: UserDataInterface = await response.json();
    return (
        <PageLayout breakpoint="770px">
            <MainDiv className="py-3">
                <div className="flex items-center gap-4 px-6 mb-5">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full p-1 overflow-hidden bg-slate-300">
                        <img
                            src={userData.profile_picture}
                            alt="Profile Picture"
                            className="w-full h-full rounded-full"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-medium">
                            {userData.displayname}
                        </h2>
                        <p className="text-neutral-500 font-medium">
                            u/{userData.username}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 pb-2 mx-2 mb-2 border-b border-slate-400 border-dashed">
                    <Link href={`/user/${username}`}>
                        <RoundedButton>
                            <span className="text-sm font-medium text-neutral-700 px-3">
                                Posts
                            </span>
                        </RoundedButton>
                    </Link>
                    <Link href={`/user/${username}/comments`}>
                        <RoundedButton>
                            <span className="text-sm font-medium text-neutral-700 px-3">
                                Comments
                            </span>
                        </RoundedButton>
                    </Link>
                </div>

                {children}
            </MainDiv>

            <Sidebar>
                <div className="bg-slate-100/80 rounded-2xl">
                    <div className="w-full max-h-14 min-h-[1px] mb-5">
                        {userData.banner && (
                            <img
                                src={userData.banner}
                                alt="Banner Image"
                                className="w-full h-full rounded-t-2xl"
                            />
                        )}
                    </div>

                    <div className="px-3.5 pb-4">
                        {/* Basic */}
                        <div className="flex items-center justify-between gap-2 px-2 mb-2">
                            <h3 className="text-base font-semibold">
                                {userData.displayname}
                            </h3>

                            <Popover
                                position="bottom"
                                axis="right"
                                className="text-base rounded-xl overflow-hidden"
                                indicator={false}
                                content={
                                    <div className="min-w-36">
                                        <SquareButton
                                            className="w-full"
                                            Icon={TbShare3}
                                        >
                                            Share
                                        </SquareButton>

                                        <SquareButton
                                            className="w-full"
                                            Icon={CiMail}
                                        >
                                            Send a Message
                                        </SquareButton>
                                        <SquareButton
                                            className="w-full"
                                            Icon={LiaUserAltSlashSolid}
                                        >
                                            Block Account
                                        </SquareButton>
                                        <SquareButton
                                            className="w-full"
                                            Icon={IoFlagOutline}
                                        >
                                            Report Profile
                                        </SquareButton>
                                    </div>
                                }
                            >
                                <RoundedButton className="z-[1]">
                                    <HiOutlineDotsHorizontal className="text-lg" />
                                </RoundedButton>
                            </Popover>
                        </div>

                        {!userData.bio && (
                            <p className="text-sm italic text-slate-500 px-2">
                                No Biography Added
                            </p>
                        )}

                        {userData.bio && (
                            <>
                                <p className="text-sm text-slate-500 px-2">
                                    {userData.bio}
                                </p>
                                <p className="text-right text-sm italic text-neutral-500 px-2">
                                    - {userData.username}
                                </p>
                            </>
                        )}

                        <div className="pb-2.5 mb-2.5 border-b border-neutral-400"></div>

                        {/* Gender */}
                        <p className="flex items-center gap-2 px-2">
                            <span className="text-sm font-medium text-neutral-500">
                                Gender:
                            </span>
                            {userData.gender ? (
                                <span className="text-sm">
                                    {userData.gender}
                                </span>
                            ) : (
                                <span className="italic text-sm text-neutral-600">
                                    Unknown
                                </span>
                            )}
                        </p>

                        <div className="pb-2.5 mb-2.5 border-b border-neutral-400"></div>

                        {/* Statistics */}
                        <div className="flex items-center gap-3 justify-around text-sm text-center">
                            <p className="flex flex-col">
                                <span className="font-semibold text-base">
                                    {ShortNumber(userData.postsCount)}
                                </span>
                                <span className="text-neutral-500">Posts</span>
                            </p>
                            <p className="flex flex-col">
                                <span className="font-semibold text-base">
                                    {ShortNumber(userData.commentsCount)}
                                </span>
                                <span className="text-neutral-500">
                                    Comments
                                </span>
                            </p>
                            <p className="flex flex-col">
                                <span className="font-semibold text-base">
                                    {new Date(
                                        userData.createdAt
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                    })}
                                </span>
                                <span className="text-neutral-500">
                                    Cake Day
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default UserLayout;
