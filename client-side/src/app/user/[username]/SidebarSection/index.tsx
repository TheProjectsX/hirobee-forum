"use client";

import React from "react";
import Popover from "@/components/Popover";
import SquareButton from "@/components/Buttons/Square";
import RoundedButton from "@/components/Buttons/Rounded";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoFlagOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { LiaUserAltSlashSolid } from "react-icons/lia";
import { TbMoodEdit, TbShare3 } from "react-icons/tb";
import { ShortNumber } from "@lytieuphong/short-number";
import { UserDataInterface } from "../layout";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useReportUserMutation } from "@/store/features/users/usersApiSlice";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";

const SidebarSection = ({ userData }: { userData: UserDataInterface }) => {
    const {
        data: userInfo,
        isLoading: isUserInfoLoading,
        isError: isUserInfoError,
        isSuccess: isUserInfoSuccess,
    } = useSelector((state: any) => state.user_info);

    const [reportUser] = useReportUserMutation();

    // Report User
    const handleReportPost = async (username: string) => {
        if (!isUserInfoLoading && isUserInfoError) {
            return;
        }

        const result = await Swal.fire({
            title: "Select your Report",
            input: "select",
            inputOptions: {
                "Fake account": "Fake account",
                Harassment: "Harassment",
                "Inappropriate behavior": "Inappropriate behavior",
                Spamming: "Spamming",
                Impersonation: "Impersonation",
            },
            inputPlaceholder: "Select a Report",
            showCancelButton: true,
        });

        if (result.isDismissed) return;

        try {
            const data = {
                username,
                body: { report: result.value },
            };
            const response = await reportUser(data).unwrap();

            toast.success("Successfully Reported User");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Send Report");
        }
    };

    return (
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

                                <SquareButton className="w-full" Icon={CiMail}>
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
                                    onClick={() =>
                                        handleReportPost(userData.username)
                                    }
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

                <div className="pb-4 mb-4 border-b border-neutral-400"></div>

                {/* Gender */}
                <p className="flex items-center gap-2 px-2">
                    <span className="text-sm font-medium text-neutral-500">
                        Gender:
                    </span>
                    {userData.gender ? (
                        <span className="text-sm">{userData.gender}</span>
                    ) : (
                        <span className="italic text-sm text-neutral-600">
                            Unknown
                        </span>
                    )}
                </p>

                <div className="pb-4 mb-4 border-b border-neutral-400"></div>

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
                        <span className="text-neutral-500">Comments</span>
                    </p>
                    <p className="flex flex-col">
                        <span className="font-semibold text-base">
                            {new Date(userData.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                }
                            )}
                        </span>
                        <span className="text-neutral-500">Cake Day</span>
                    </p>
                </div>

                {userInfo && (
                    <>
                        {" "}
                        <div className="pb-4 mb-4 border-b border-neutral-400"></div>
                        {/* Settings */}
                        <div>
                            <h3 className="uppercase text-sm font-semibold mb-2">
                                Settings
                            </h3>

                            <div className="flex items-center justify-between gap-2 px-2 py-2 mb-3">
                                <div className="flex gap-2 items-center">
                                    <CgProfile className="text-3xl text-slate-600" />
                                    <p className="flex flex-col">
                                        <span className="text-sm">Profile</span>
                                        <span className="text-xs text-neutral-600">
                                            Customize your profile
                                        </span>
                                    </p>
                                </div>

                                <Link href={"#"}>
                                    <RoundedButton className="bg-slate-200 hover:underline">
                                        <span className="text-xs font-semibold px-2">
                                            Update
                                        </span>
                                    </RoundedButton>
                                </Link>
                            </div>

                            <div className="flex items-center justify-between gap-2 px-2 py-2 mb-3">
                                <div className="flex gap-2 items-center">
                                    <TbMoodEdit className="text-3xl text-slate-600" />
                                    <p className="flex flex-col">
                                        <span className="text-sm">Avatar</span>
                                        <span className="text-xs text-neutral-600">
                                            Customize and Style
                                        </span>
                                    </p>
                                </div>

                                <Link href={"#"}>
                                    <RoundedButton className="bg-slate-200 hover:underline">
                                        <span className="text-xs font-semibold px-2">
                                            Update
                                        </span>
                                    </RoundedButton>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SidebarSection;
