"use client";

import React, { useState } from "react";
import Comment, { CommentInterface } from "./comment";

import RoundedButton from "@/components/Buttons/Rounded";
import Button from "@/components/PreviewPost/Button";
import { useFetchCommentsQuery } from "@/store/features/comments/commentsApiSlice";
import { useFetchUserInfoQuery } from "@/store/features/userInfo/userInfoApiSlice";
import { toast } from "react-toastify";

const CommentSection = ({ postId }: { postId: string }) => {
    const { data: UserInfo, isLoading: isUserInfoLoading } =
        useFetchUserInfoQuery({});

    const [commentBoxStatus, setCommentBoxStatus] = useState<{
        opened: boolean;
        content: string;
    }>({ opened: false, content: "" });

    const {
        data: commentsData,
        isLoading,
        isSuccess,
    } = useFetchCommentsQuery(postId);

    return (
        <>
            {/* Comment Box */}
            <div className="mb-2.5">
                {!commentBoxStatus.opened && (
                    <button
                        className="block w-full outline-none border border-neutral-400 rounded-full px-4 py-2.5 text-slate-500 text-left text-sm cursor-text"
                        onClick={(e) => {
                            if (!UserInfo && !isUserInfoLoading) {
                                return toast.info("You Must Login First!");
                            }

                            setCommentBoxStatus((prev) => ({
                                ...prev,
                                opened: true,
                            }));
                        }}
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
                                        <span className="text-xs">Cancel</span>
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
                {isLoading && (
                    <p className="italic py-4 font-semibold text-neutral-500">
                        Fetching Comments...
                    </p>
                )}

                {isSuccess && commentsData.data.length === 0 && (
                    <p className="italic py-4 font-semibold text-neutral-500">
                        No Comments Yet!
                    </p>
                )}

                {isSuccess &&
                    commentsData.data.length > 0 &&
                    commentsData.data.map(
                        (commentData: CommentInterface, idx: number) => (
                            <Comment key={idx} commentData={commentData} />
                        )
                    )}
            </div>
        </>
    );
};

export default CommentSection;
