import React from "react";
import { StatCard } from "./StatCard";
import { PiUsersThree } from "react-icons/pi";
import { TbFileDescription, TbMessageCircle } from "react-icons/tb";
import Title from "./Title";

const Dashboard = () => {
    return (
        <div>
            <Title>Site Stats</Title>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <StatCard
                    Icon={PiUsersThree}
                    label="Total Users"
                    value={1203}
                />
                <StatCard
                    Icon={TbFileDescription}
                    label="Total Posts"
                    value={4567}
                />
                <StatCard
                    Icon={TbMessageCircle}
                    label="Comments"
                    value={8931}
                />
            </div>

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
