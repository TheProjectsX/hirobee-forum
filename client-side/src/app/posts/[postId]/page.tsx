import RoundedButton from "@/components/Buttons/Rounded";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost, { PostInterface } from "@/components/PreviewPost";
import React from "react";
import Link from "next/link";

import { PiCakeThin } from "react-icons/pi";
import { CiGlobe } from "react-icons/ci";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import CommentSection from "./CommentSection";
import SidebarPost from "@/components/PreviewPost/SidebarPost";
import { ShortNumber } from "@lytieuphong/short-number";
import Join from "@/app/subhiro/[subhiroId]/Join";

const Post = async ({ params }: { params: Promise<{ postId: string }> }) => {
    const { postId } = await params;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`
    );
    if (response.status !== 200) {
        return notFound();
    }

    const postData = await response.json();

    return (
        <PageLayout breakpoint="770px">
            <MainDiv className="py-2">
                {/* Post Preview (Client Component) */}
                <PreviewPost className="mb-3" postData={postData} fullPreview />

                {/* Comment Section (Client Component) */}
                <CommentSection postId={postId} />
            </MainDiv>

            {/* About SubHiro OR Recent Posts */}
            <Sidebar className="h-fit">
                <div className="px-3.5 py-5 bg-slate-100/80 rounded-md">
                    {/* Subhiro Data */}
                    {postData.subhiroData && (
                        <div>
                            {/* Description */}
                            <div className="text-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="font-bold text-lg">
                                        {postData.subhiroData.displayname}
                                    </h2>
                                    <Join
                                        subhiroId={
                                            postData.subhiroData.hironame
                                        }
                                    />
                                </div>
                                <div className="whitespace-pre-line text-neutral-500 mb-2.5">
                                    {postData.subhiroData.description}
                                </div>

                                <p className="flex items-center gap-1 text-neutral-500">
                                    <PiCakeThin className="text-base" />
                                    Created{" "}
                                    {new Date(
                                        postData.subhiroData.createdAt
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
                                            {ShortNumber(
                                                postData.subhiroData
                                                    .membersCount
                                            )}
                                        </span>
                                        <span className="text-neutral-500">
                                            Members
                                        </span>
                                    </p>
                                    <p className="flex flex-col">
                                        <span className="font-semibold text-base">
                                            {ShortNumber(
                                                postData.subhiroData.postsCount
                                            )}
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
                                    {postData.subhiroData.rules.map(
                                        (rule: string, idx: number) => (
                                            <li key={idx}>{rule}</li>
                                        )
                                    )}
                                </ol>
                            </div>
                        </div>
                    )}

                    {postData.authorRecentPosts && (
                        <div>
                            <h3 className="uppercase text-neutral-500 font-medium text-xs">
                                Author Recent Posts
                            </h3>

                            {postData.authorRecentPosts
                                ?.slice(0, 5)
                                .map((post: PostInterface, idx: number) => (
                                    <React.Fragment key={idx}>
                                        <SidebarPost postData={post} />
                                        <div className="pb-0.5 mb-0.5 border-b border-neutral-300"></div>
                                    </React.Fragment>
                                ))}
                        </div>
                    )}
                </div>

                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default Post;
