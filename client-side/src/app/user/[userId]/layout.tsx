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

// import RoundedButton from "@/components/Buttons/Rounded";
// import Link from "next/link";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PageLayout>
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
                {/* <div className="flex items-center gap-3 mb-2">
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
                </div> */}

                {children}
            </MainDiv>
            <Sidebar breakpoint="770px">
                <div className="bg-slate-100/80 rounded-2xl">
                    <div className="w-full max-h-14 min-h-[1px] mb-5">
                        {/* <img
                            src="https://placehold.co/600x120"
                            alt="Banner Image"
                            className="w-full h-full rounded-t-2xl"
                        /> */}
                    </div>

                    <div className="px-3.5 pb-1">
                        {/* Basic */}
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-semibold">
                                SomeHeroIAm!
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
                    </div>
                </div>
                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default UserLayout;
