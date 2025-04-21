import React from "react";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import Footer from "@/components/Footer";

import RoundedButton from "@/components/Buttons/Rounded";

import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { TbMoodEdit } from "react-icons/tb";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PageLayout breakpoint="770px">
            <MainDiv>
                <div className="flex items-center gap-4 px-6 mb-5">
                    <div className="w-20 h-20 flex items-center justify-center rounded-full p-1 overflow-hidden bg-slate-300">
                        <img
                            src="https://placehold.co/400"
                            alt="Profile Picture"
                            className="w-full h-full rounded-full"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-medium">SomeHeroIAm!</h2>
                        <p className="text-neutral-500 font-medium">
                            u/SomeHeroIAm!
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-3 mb-2">
                    <Link href={`./someId`}>
                        <RoundedButton>
                            <span className="text-sm font-medium text-neutral-700 px-3">
                                Posts
                            </span>
                        </RoundedButton>
                    </Link>
                    <Link href={`./someId/comments`}>
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
                    <div className="w-full h-20 min-h-[1px] mb-5">
                        <img
                            src="https://placehold.co/600x120"
                            alt="Banner Image"
                            className="w-full h-full object-cover rounded-t-2xl"
                        />
                    </div>

                    <div className="px-3.5 pb-1">
                        {/* Basic */}
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-semibold">
                                SomeHeroIAm!
                            </h3>
                        </div>

                        {/* Statistics */}
                        <div className="flex items-center gap-3 pt-4 justify-around text-sm">
                            <p className="flex flex-col">
                                <span className="font-semibold text-base">
                                    44K
                                </span>
                                <span className="text-neutral-500">Posts</span>
                            </p>
                            <p className="flex flex-col">
                                <span className="font-semibold text-base">
                                    452K
                                </span>
                                <span className="text-neutral-500">
                                    Comments
                                </span>
                            </p>
                            <p className="flex flex-col">
                                <span className="font-semibold text-base">
                                    Mar 12, 2022
                                </span>
                                <span className="text-neutral-500">
                                    Cake Day
                                </span>
                            </p>
                        </div>
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
                    </div>
                </div>
                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default UserLayout;
