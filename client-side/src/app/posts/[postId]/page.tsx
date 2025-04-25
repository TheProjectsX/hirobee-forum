import RoundedButton from "@/components/Buttons/Rounded";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PreviewPost";
import Button from "@/components/PreviewPost/Button";
import React from "react";
import Comment from "./comment";
import Link from "next/link";

import { PiCakeThin } from "react-icons/pi";
import { CiGlobe } from "react-icons/ci";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import CommentSection from "./CommentSection";

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

            {/* About SubHiro */}
            <Sidebar className="h-fit">
                <div className="px-3.5 py-5 bg-slate-100/80 rounded-md">
                    <header className="flex items-center gap-2 justify-between mb-3">
                        <Link href={"/h/"} className="font-semibold text-lg">
                            h/AskHirobee
                        </Link>
                        <RoundedButton className="!bg-blue-700 hover:!bg-blue-800 !px-6">
                            <span className="text-xs text-white font-semibold">
                                Join
                            </span>
                        </RoundedButton>
                    </header>

                    {/* Description */}
                    <div className="text-sm">
                        <h2 className="font-bold">Ask Hirobee</h2>
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
                                <span className="text-neutral-500">Posts</span>
                            </p>
                        </div>
                    </div>
                </div>

                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default Post;
