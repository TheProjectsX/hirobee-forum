"use client";

import React, { useState } from "react";

import RoundedButton from "@/components/Buttons/Rounded";
import Button from "@/components/PreviewPost/Button";
import {
    useFetchCommentsQuery,
    useInsertCommentMutation,
} from "@/store/features/comments/commentsApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalType } from "@/store/features/config/configSlice";
import PreviewComment, { CommentInterface } from "@/components/PreviewComment";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import AuthButtonWrapper from "@/components/AuthButtonWrapper";

const CommentSection = ({ postId }: { postId: string }) => {
    const dispatch = useDispatch();

    const { data: UserInfo, isLoading: isUserInfoLoading } = useSelector(
        (state: any) => state.user_info
    );
    const [submitComment, { isLoading: isSubmitCommentLoading }] =
        useInsertCommentMutation();

    const {
        data: commentsData,
        isLoading,
        isSuccess,
        refetch: refetchComments,
    } = useFetchCommentsQuery({ postId });

    const [commentBoxStatus, setCommentBoxStatus] = useState<{
        opened: boolean;
        content: string;
    }>({ opened: false, content: "" });

    const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            postId,
            body: {
                content: commentBoxStatus.content,
            },
        };

        try {
            const response = await submitComment(data).unwrap();
            refetchComments();

            toast.success("Comment Submitted");

            setCommentBoxStatus({ content: "", opened: false });
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Submit Comment");
        }
    };

    return (
        <>
            {/* Comment Box */}
            <div className="mb-2.5">
                {!commentBoxStatus.opened && (
                    <AuthButtonWrapper>
                        <button
                            className="block w-full outline-none border border-neutral-400 rounded-full px-4 py-2.5 text-slate-500 text-left text-sm cursor-text"
                            onClick={(e) => {
                                if (!UserInfo && !isUserInfoLoading) {
                                    return dispatch(setAuthModalType("login"));
                                }

                                setCommentBoxStatus((prev) => ({
                                    ...prev,
                                    opened: true,
                                }));
                            }}
                        >
                            Add a comment
                        </button>
                    </AuthButtonWrapper>
                )}

                {commentBoxStatus.opened && (
                    <div className="p-2 rounded-[1.25rem] border border-neutral-300 focus-within:border-neutral-500">
                        <form onSubmit={handleSubmitComment}>
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
                                required
                                minLength={5}
                            ></textarea>

                            <div className="flex items-center gap-3 justify-between">
                                <RoundedButton type="button">
                                    <span className="text-xs">Aa</span>
                                </RoundedButton>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
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
                                        className={`!bg-blue-700 ${
                                            isSubmitCommentLoading
                                                ? "hover:!bg-blue-700 cursor-not-allowed"
                                                : "hover:!bg-blue-800"
                                        }`}
                                        disabled={isSubmitCommentLoading}
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
                {isLoading && <LoadingPlaceholder />}

                {isSuccess && commentsData.data.length === 0 && (
                    <p className="italic py-4 font-semibold text-neutral-500">
                        No Comments Yet!
                    </p>
                )}

                {isSuccess &&
                    commentsData.data.length > 0 &&
                    commentsData.data.map(
                        (commentData: CommentInterface, idx: number) => (
                            <PreviewComment
                                key={idx}
                                commentData={commentData}
                                onDelete={refetchComments}
                                onUpdate={refetchComments}
                            />
                        )
                    )}
            </div>
        </>
    );
};

export default CommentSection;
