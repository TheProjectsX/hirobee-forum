"use client";

import RoundedButton from "@/components/Buttons/Rounded";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PreviewPost";
import Button from "@/components/PreviewPost/Button";
import React, { useState } from "react";

const Post = () => {
    const [commentBoxOpened, setCommentBoxOpened] = useState<boolean>(false);

    return (
        <PageLayout>
            <MainDiv className="py-2">
                {/* Post Preview */}
                <PreviewPost className="mb-3" fullPreview />

                {/* Comment Section */}

                {/* Comment Box */}
                <div className="mb-2.5">
                    {!commentBoxOpened && (
                        <button
                            className="block w-full outline-none border border-neutral-400 rounded-full px-4 py-2.5 text-slate-500 text-left text-sm cursor-text"
                            onClick={(e) => setCommentBoxOpened(true)}
                        >
                            Add a comment
                        </button>
                    )}

                    {commentBoxOpened && (
                        <div className="p-2 rounded-[1.25rem] border border-neutral-300 focus-within:border-neutral-500">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <textarea
                                    name="comment"
                                    rows={2}
                                    className="w-full outline-none border-none mb-3 text-sm px-1.5"
                                    autoFocus
                                ></textarea>

                                <div className="flex items-center gap-3 justify-between">
                                    <RoundedButton>
                                        <span className="text-xs">Aa</span>
                                    </RoundedButton>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={(e) =>
                                                setCommentBoxOpened(false)
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
                <div>Comments</div>
            </MainDiv>

            <Sidebar>Where am I?</Sidebar>
        </PageLayout>
    );
};

export default Post;
