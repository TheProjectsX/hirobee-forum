"use client";

import RoundedButton from "@/components/Buttons/Rounded";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PreviewPost";
import Button from "@/components/PreviewPost/Button";
import React, { useState } from "react";
import Comment from "./comment";
import Link from "next/link";

import { PiCakeThin } from "react-icons/pi";
import { CiGlobe } from "react-icons/ci";
import Footer from "@/components/Footer";

const Post = () => {
    const [commentBoxStatus, setCommentBoxStatus] = useState<{
        opened: boolean;
        content: string;
    }>({ opened: false, content: "" });

    return (
        <PageLayout breakpoint="770px">
            <MainDiv className="py-2">
                {/* Post Preview */}
                <PreviewPost className="mb-3" fullPreview />

                {/* Comment Section */}

                {/* Comment Box */}
                <div className="mb-2.5">
                    {!commentBoxStatus.opened && (
                        <button
                            className="block w-full outline-none border border-neutral-400 rounded-full px-4 py-2.5 text-slate-500 text-left text-sm cursor-text"
                            onClick={(e) =>
                                setCommentBoxStatus((prev) => ({
                                    ...prev,
                                    opened: true,
                                }))
                            }
                        >
                            Add a comment
                        </button>
                    )}

                    {commentBoxStatus.opened && (
                        <div className="p-2 rounded-[1.25rem] border border-neutral-300 focus-within:border-neutral-500">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <textarea
                                    name="comment"
                                    rows={2}
                                    className="w-full outline-none border-none mb-3 text-sm px-1.5"
                                    value={commentBoxStatus.content}
                                    onChange={(e) =>
                                        setCommentBoxStatus((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    autoFocus
                                ></textarea>

                                <div className="flex items-center gap-3 justify-between">
                                    <RoundedButton>
                                        <span className="text-xs">Aa</span>
                                    </RoundedButton>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={(e) =>
                                                setCommentBoxStatus((prev) => ({
                                                    ...prev,
                                                    opened: false,
                                                }))
                                            }
                                        >
                                            <span className="text-xs">
                                                Cancel
                                            </span>
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="!bg-blue-700 hover:!bg-blue-800"
                                        >
                                            <span className="text-xs text-white">
                                                Comment
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Comments Preview */}
                <div>
                    {[...Array(4)].map((i, idx) => (
                        <Comment key={idx} />
                    ))}
                </div>
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
