import React from "react";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import Footer from "@/components/Footer";
import RoundedButton from "@/components/Buttons/Rounded";
import { notFound } from "next/navigation";
import Link from "next/link";
import SidebarSection from "./SidebarSection";

export interface UserDataInterface {
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
                <SidebarSection userData={userData} />
                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default UserLayout;
