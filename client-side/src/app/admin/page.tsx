"use client";

import React from "react";
import StatCard from "./StatCard";
import { PiUsersThree } from "react-icons/pi";
import { TbFileDescription, TbMessageCircle } from "react-icons/tb";
import Title from "@/components/Title";
// import { redirect } from "next/navigation";
import { ShortNumber } from "@lytieuphong/short-number";
import { useFetchStatsQuery } from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { RiUserCommunityLine } from "react-icons/ri";
import { LuUserPlus } from "react-icons/lu";
import { FiFilePlus } from "react-icons/fi";

const Dashboard = () => {
    const loader = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34.67"
            height="8"
            viewBox="0 44 52 12"
        >
            <circle fill="#000" stroke="none" cx="6" cy="50" r="6">
                <animate
                    attributeName="opacity"
                    dur="1.2s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.1"
                />
            </circle>
            <circle fill="#000" stroke="none" cx="26" cy="50" r="6">
                <animate
                    attributeName="opacity"
                    dur="1.2s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.2"
                />
            </circle>
            <circle fill="#000" stroke="none" cx="46" cy="50" r="6">
                <animate
                    attributeName="opacity"
                    dur="1.2s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.3"
                />
            </circle>
        </svg>
    );

    const { data: adminStats, isSuccess } = useFetchStatsQuery({});

    return (
        <div>
            <Title>Site Stats</Title>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <StatCard
                    Icon={PiUsersThree}
                    label="Total Users"
                    value={
                        isSuccess ? ShortNumber(adminStats.total.users) : loader
                    }
                />
                <StatCard
                    Icon={TbFileDescription}
                    label="Total Posts"
                    value={
                        isSuccess ? ShortNumber(adminStats.total.posts) : loader
                    }
                />
                <StatCard
                    Icon={TbMessageCircle}
                    label="Total Comments"
                    value={
                        isSuccess
                            ? ShortNumber(adminStats.total.comments)
                            : loader
                    }
                />
                <StatCard
                    Icon={RiUserCommunityLine}
                    label="Total Subhiro"
                    value={
                        isSuccess
                            ? ShortNumber(adminStats.total.subhiro)
                            : loader
                    }
                />
                <StatCard
                    Icon={LuUserPlus}
                    label="Users This Week"
                    value={
                        isSuccess
                            ? ShortNumber(adminStats.this_week.users)
                            : loader
                    }
                />
                <StatCard
                    Icon={FiFilePlus}
                    label="Posts This Week"
                    value={
                        isSuccess
                            ? ShortNumber(adminStats.this_week.posts)
                            : loader
                    }
                />
            </div>

            {/* <Title>New SubHiro</Title>
            <div className="text-xs italic text-neutral-400 space-y-2">
                <p>
                    This part of the Design is left for the future me to deal
                    with. I am not interested anymore to design more UI. I hate
                    designing UIs. Just to show my logic creation talent, I need
                    to write endless amount of JSX.
                </p>
                <p>
                    Though I should finish this. But if I try more hard, my
                    brain will give up in this project as well, as my other
                    non-finished projects.
                </p>
                <p>
                    So, I will just leave it at this. And while adding the APIs,
                    if I feel like I have time or find motivation to do so, I
                    will create this section
                </p>
            </div> */}
        </div>
    );
};

export default Dashboard;
