import RoundedButton from "@/components/Buttons/Rounded";
import React from "react";
import { FiPlus } from "react-icons/fi";

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
        </div>
    );
};

export default SubHiro;
