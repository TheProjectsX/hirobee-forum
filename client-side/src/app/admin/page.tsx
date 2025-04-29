"use client";

import React from "react";
import StatCard from "./StatCard";
import { PiUsersThree } from "react-icons/pi";
import { TbFileDescription, TbMessageCircle } from "react-icons/tb";
import Title from "./Title";
// import { redirect } from "next/navigation";
import { ShortNumber } from "@lytieuphong/short-number";
import { useFetchStatsQuery } from "@/store/features/admin/adminApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { RiUserCommunityLine } from "react-icons/ri";
import { LuUserPlus } from "react-icons/lu";
import { FiFilePlus } from "react-icons/fi";

const Dashboard = () => {
    const { data: adminStats, isLoading, isSuccess } = useFetchStatsQuery({});

    return (
        <div>
            <Title>Site Stats</Title>

            {isLoading && <LoadingPlaceholder />}

            {isSuccess && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <StatCard
                        Icon={PiUsersThree}
                        label="Total Users"
                        value={ShortNumber(adminStats.total.users)}
                    />
                    <StatCard
                        Icon={TbFileDescription}
                        label="Total Posts"
                        value={ShortNumber(adminStats.total.posts)}
                    />
                    <StatCard
                        Icon={TbMessageCircle}
                        label="Total Comments"
                        value={ShortNumber(adminStats.total.comments)}
                    />
                    <StatCard
                        Icon={RiUserCommunityLine}
                        label="Total Subhiro"
                        value={ShortNumber(adminStats.total.subhiro)}
                    />
                    <StatCard
                        Icon={LuUserPlus}
                        label="Users This Week"
                        value={ShortNumber(adminStats.this_week.users)}
                    />
                    <StatCard
                        Icon={FiFilePlus}
                        label="Posts This Week"
                        value={ShortNumber(adminStats.this_week.posts)}
                    />
                </div>
            )}

            <Title>New SubHiro</Title>
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
            </div>
        </div>
    );
};

export default Dashboard;
