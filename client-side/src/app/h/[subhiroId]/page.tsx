import React from "react";

import RoundedButton from "@/components/Buttons/Rounded";
import Dropdown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PreviewPost";

import { CiGlobe } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { PiCakeThin } from "react-icons/pi";
import { BsPinAngle } from "react-icons/bs";
import Highlights from "./Highlights";

const SubHiro = () => {
    const user = {
        joined: false,
    };

    return (
        <div>
            {/* Top Preview */}
            <div>
                {/* Banner */}
                <div
                    className="bg-center bg-no-repeat bg-cover h-16 md:h-24 md:mx-3 md:mt-2 md:rounded-2xl"
                    style={{
                        backgroundImage: `url(${"https://styles.redditmedia.com/t5_7hqomg/styles/bannerBackgroundImage_9ujha2cxxgzc1.jpg?format=pjpg&s=590df3b109277fce50655c17de61988ecf11f41b"})`,
                    }}
                ></div>

                <header className="flex flex-col sm:flex-row flex-wrap gap-2 sm:justify-between sm:items-center p-3 md:py-1.5">
                    <div className="flex items-center gap-1 md:pl-4">
                        <div className="w-12 h-12 bg-white p-1.5 md:p-0.5 md:mx-6 rounded-full md:scale-[180%] md:relative -top-4">
                            <img
                                src="http://placehold.co/80"
                                alt="SubHiro Profile Picture"
                                className="rounded-full w-full h-full"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg md:text-3xl">
                                h/AskHirobee
                            </h2>
                            <div className="md:hidden">
                                <p className="text-xs text-neutral-500">
                                    <span>439K Members</span>
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

                        {user.joined && (
                            <RoundedButton className="border border-neutral-600 px-3.5">
                                <span className="text-sm font-medium">
                                    Joined
                                </span>
                            </RoundedButton>
                        )}

                        {!user.joined && (
                            <RoundedButton className="!bg-green-600 hover:!bg-green-700 px-3.5">
                                <span className="text-white font-medium text-sm">
                                    Join
                                </span>
                            </RoundedButton>
                        )}
                    </div>
                </header>
            </div>

            <PageLayout>
                <MainDiv className="py-4">
                    {/* Community Highlights */}
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
                            <Highlights images={["https://placehold.co/404"]} />
                        </div>
                    </Dropdown>

                    <div className="py-3">
                        {[...Array(6)].map((i, idx) => (
                            <React.Fragment key={idx}>
                                <div className="pb-1 mb-1 border-b border-neutral-300"></div>
                                <PreviewPost />
                            </React.Fragment>
                        ))}
                    </div>
                </MainDiv>
                <Sidebar className="h-fit">
                    <div className="px-3.5 py-5 bg-slate-100/80 rounded-md">
                        {/* Description */}
                        <div className="text-sm">
                            <h2 className="font-bold text-lg">Ask Hirobee</h2>
                            <div className="whitespace-pre-line text-neutral-500 mb-1">
                                Ask Anything about Anything. {"\n"}
                                Your Questions, {"\n"}
                                Hirobee will Anser!
                            </div>

                            <p className="flex items-center gap-1 text-neutral-500">
                                <PiCakeThin className="text-base" />
                                Created Jun 4, 2025
                            </p>
                            <p className="flex items-center gap-1 text-neutral-500">
                                <CiGlobe className="text-base" />
                                Public
                            </p>

                            <div className="flex items-center gap-3 pt-4 justify-around">
                                <p className="flex flex-col">
                                    <span className="font-semibold text-base">
                                        44K
                                    </span>
                                    <span className="text-neutral-500">
                                        Members
                                    </span>
                                </p>
                                <p className="flex flex-col">
                                    <span className="font-semibold text-base">
                                        452K
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
                                Disclaimer
                            </h3>

                            <div className="whitespace-pre-line">
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Repellat tenetur aspernatur
                                voluptatibus ipsa blanditiis harum accusantium
                                minima sed voluptatem incidunt rerum, molestiae,
                                {"\n"}fugit aut quaerat iure inventore vero eum
                                saepe neque fuga provident sit pariatur
                                consequuntur fugiat. Cupiditate maxime eaque
                                architecto dolorem possimus adipisci, assumenda
                                labore ipsum dicta quis beatae a! Beatae,
                                commodi ab? Molestias.
                            </div>
                        </div>
                    </div>
                    <Footer />
                </Sidebar>
            </PageLayout>
        </div>
    );
};

export default SubHiro;
