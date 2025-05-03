import React from "react";

import RoundedButton from "@/components/Buttons/Rounded";
import Dropdown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";

import { CiGlobe } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { PiCakeThin } from "react-icons/pi";
import { BsPinAngle } from "react-icons/bs";
import Highlights from "./Highlights";
import { notFound } from "next/navigation";
import { ShortNumber } from "@lytieuphong/short-number";
import Join from "./Join";

interface SubhiroDataInterface {
    displayname: string;
    hironame: string;
    description: string;
    profile_picture: string;
    banner: string | null;
    rules: string[];
    highlights: Array<{}> | null;
    membersCount: number;
    postsCount: number;
    createdAt: number;
}

const SubHiroLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ subhiroId: string }>;
}) => {
    const { subhiroId } = await params;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subhiro/${subhiroId}`
    );
    if (response.status !== 200) {
        return notFound();
    }

    const subhiroData: SubhiroDataInterface = await response.json();

    return (
        <div>
            {/* Top Preview */}
            <div>
                {/* Banner */}
                <div
                    className="bg-center bg-no-repeat bg-cover h-16 md:h-24 md:mx-3 md:mt-2 md:rounded-2xl bg-gray-200"
                    style={
                        subhiroData.banner
                            ? {
                                  backgroundImage: `url(${subhiroData.banner})`,
                              }
                            : {}
                    }
                ></div>

                <header className="flex flex-col sm:flex-row flex-wrap gap-2 sm:justify-between sm:items-center p-3 md:py-1.5">
                    <div className="flex items-center gap-1 md:pl-4">
                        <div className="w-12 h-12 bg-white p-1.5 md:p-0.5 md:mx-6 rounded-full md:scale-[180%] md:relative -top-4">
                            <img
                                src={subhiroData.profile_picture}
                                alt="SubHiro Profile Picture"
                                className="rounded-full w-full h-full"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg md:text-2xl">
                                h/{subhiroData.hironame}
                            </h2>
                            <div className="md:hidden">
                                <p className="text-xs text-neutral-500">
                                    <span>
                                        {ShortNumber(subhiroData.membersCount)}{" "}
                                        Members
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Extra Info */}
                    <div className="flex items-center gap-2">
                        <RoundedButton className="border border-neutral-500 px-3.5">
                            <FiPlus className="text-xl" />
                            <span className="text-sm font-medium px-1">
                                Create Post
                            </span>
                        </RoundedButton>

                        <Join subhiroId={subhiroId} />
                    </div>
                </header>
            </div>

            <PageLayout>
                <MainDiv className="py-4">
                    {/* Community Highlights */}
                    {subhiroData.highlights && (
                        <Dropdown
                            label={
                                <p className="flex items-center gap-2">
                                    <BsPinAngle className="text-lg" />{" "}
                                    <span className="text-black text-sm normal-case font-medium">
                                        Community highlights
                                    </span>
                                </p>
                            }
                        >
                            <div className="py-2 grid sm:grid-cols-2 gap-3">
                                <Highlights />
                                <Highlights
                                    images={["https://placehold.co/404"]}
                                />
                            </div>
                        </Dropdown>
                    )}

                    {children}
                </MainDiv>
                <Sidebar className="h-fit">
                    <div className="px-3.5 py-5 bg-slate-100/80 rounded-md">
                        {/* Description */}
                        <div className="text-sm">
                            <h2 className="font-bold text-lg mb-1">
                                {subhiroData.displayname}
                            </h2>
                            <div className="whitespace-pre-line text-neutral-500 mb-2.5">
                                {subhiroData.description}
                            </div>

                            <p className="flex items-center gap-1 text-neutral-500">
                                <PiCakeThin className="text-base" />
                                Created{" "}
                                {new Date(
                                    subhiroData.createdAt
                                ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                })}
                            </p>
                            <p className="flex items-center gap-1 text-neutral-500">
                                <CiGlobe className="text-base" />
                                Public
                            </p>

                            <div className="flex items-center gap-3 pt-4 justify-around text-center">
                                <p className="flex flex-col">
                                    <span className="font-semibold text-base">
                                        {ShortNumber(subhiroData.membersCount)}
                                    </span>
                                    <span className="text-neutral-500">
                                        Members
                                    </span>
                                </p>
                                <p className="flex flex-col">
                                    <span className="font-semibold text-base">
                                        {ShortNumber(subhiroData.postsCount)}
                                    </span>
                                    <span className="text-neutral-500">
                                        Posts
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="pb-4 mb-4 border-b border-neutral-400"></div>

                        {/* Disclaimer */}
                        <div className="text-sm text-neutral-500">
                            <h3 className="uppercase font-semibold mb-2">
                                Rules
                            </h3>

                            <ol className="list-decimal pl-4">
                                {subhiroData.rules.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <Footer />
                </Sidebar>
            </PageLayout>
        </div>
    );
};

export default SubHiroLayout;
