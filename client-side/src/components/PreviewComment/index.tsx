import RoundedButton from "@/components/Buttons/Rounded";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";

import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Popover from "@/components/Popover";
import SquareButton from "@/components/Buttons/Square";
import { IoFlagOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
    useDeleteCommentMutation,
    useReportCommentMutation,
    useUpdateCommentDownvoteMutation,
    useUpdateCommentMutation,
    useUpdateCommentUpvoteMutation,
} from "@/store/features/comments/commentsApiSlice";
import { useSelector } from "react-redux";
import AuthButtonWrapper from "../AuthButtonWrapper";
import Button from "../PreviewPost/Button";

export interface CommentInterface {
    _id: string;
    content: string;
    postId: string | undefined;
    postTitle: string | undefined;
    upvotedBy: Array<string>;
    downvotedBy: Array<string>;
    createdAt: number;
    updatedAt: number;
    author: {
        username: string;
        profile_picture: string;
    };
}

const PreviewComment = ({
    commentData,
    className = "",
    onUpdate = () => {},
    onDelete = () => {},
}: {
    commentData: CommentInterface;
    className?: string;
    onUpdate?: () => void;
    onDelete?: () => void;
}) => {
    const {
        data: userInfo,
        isLoading: isUserInfoLoading,
        isError: isUserInfoError,
        isSuccess: isUserInfoSuccess,
    } = useSelector((state: any) => state.user_info);

    const [deleteComment, { isLoading: isDeleteCommentLoading }] =
        useDeleteCommentMutation();

    const [updateComment] = useUpdateCommentMutation();
    const [updateUpvote] = useUpdateCommentUpvoteMutation();
    const [updateDownvote] = useUpdateCommentDownvoteMutation();
    const [reportComment] = useReportCommentMutation();

    // Upvote Post
    const handleUpvote = async (commentId: string) => {
        if (!isUserInfoLoading && isUserInfoError) {
            return;
        }

        try {
            const response = await updateUpvote({
                commentId,
            }).unwrap();
            return { newCount: response.newCount, action: response.action };
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Update Vote");
        }
    };

    // Downvote Post
    const handleDownvote = async (commentId: string) => {
        if (!isUserInfoLoading && isUserInfoError) {
            return;
        }

        try {
            const response = await updateDownvote({
                commentId,
            }).unwrap();
            return { newCount: response.newCount, action: response.action };
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Update Vote");
        }
    };

    // Update Comment (For Author of Comment only)
    const handleUpdateComment = async (commentId: string, content: string) => {
        const result = await Swal.fire({
            input: "textarea",
            inputLabel: "Edit your Comment",
            inputPlaceholder: "Enter Comment...",
            inputAttributes: {
                style: "font-size: 14px",
            },
            inputValue: content,
            confirmButtonText: "Update",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            showCancelButton: true,
        });

        if (result.isDismissed) return;

        try {
            const data = {
                body: { content: result.value },
                commentId,
            };

            const response = await updateComment(data).unwrap();
            onUpdate();
            toast.success("Comment Updated!");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Update Comment");
        }
    };

    // Delete Comment (For Author of Comment only)
    const handleDeleteComment = async (commentId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Post will be Permanently Deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isDismissed) return;

        try {
            const response = await deleteComment({
                commentId,
            }).unwrap();
            toast.success("Post Deleted!");
            onDelete();
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Delete Comment");
        }
    };

    // Report Comment
    const handleReportComment = async (commentId: string) => {
        if (!isUserInfoLoading && isUserInfoError) {
            return;
        }

        const result = await Swal.fire({
            title: "Select your Report",
            input: "select",
            inputOptions: {
                Spam: "Spam",
                "Offensive content": "Offensive content",
                Harassment: "Harassment",
                "Irrelevant or off-topic": "Irrelevant or off-topic",
                "Personal attacks": "Personal attacks",
            },
            inputPlaceholder: "Select a Report",
            showCancelButton: true,
        });

        if (result.isDismissed) return;

        try {
            const data = {
                commentId: commentId,
                body: { report: result.value },
            };
            const response = await reportComment(data).unwrap();

            toast.success("Successfully Reported Comment");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Send Report");
        }
    };

    return (
        <article
            className={`rounded-2xl relative p-3 ${
                commentData.postId && commentData.postTitle
                    ? "hover:bg-slate-100 px-3"
                    : ""
            } ${className ?? ""}`}
        >
            {/* User Info */}
            <div className="flex items-center text-xs">
                <Link
                    href={`/user/${commentData.author.username}`}
                    className="mr-2 z-[1]"
                >
                    <figure className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                            src={commentData.author.profile_picture}
                            alt="Profile Picture"
                            loading="lazy"
                            className="w-full h-full"
                        />
                    </figure>
                </Link>

                <Link
                    href={`/user/${commentData.author.username}`}
                    className="z-[1]"
                >
                    <span className="font-semibold underline-offset-4 hover:underline">
                        u/{commentData.author.username}
                    </span>
                </Link>
                <span className="text-neutral-400 mx-1.5">•</span>
                <span
                    className="text-neutral-500 shrink-0"
                    title={new Date(commentData.createdAt).toString()}
                >
                    {formatDistanceToNow(new Date(commentData.createdAt), {
                        addSuffix: true,
                    })}
                </span>
                {commentData.postId && commentData.postTitle && (
                    <>
                        <span className="text-neutral-400 mx-1.5">•</span>
                        <Link
                            href={`/posts/${commentData.postId}`}
                            className="z-[1]"
                        >
                            <span className="hover:text-blue-800 line-clamp-1 w-fit">
                                {commentData.postTitle}
                            </span>
                        </Link>
                    </>
                )}
            </div>

            {/* Content */}
            <summary className="grid grid-cols-[32px_1fr]">
                <div className="">
                    {/* Here may be some content or line in the future */}
                </div>
                <div className="text-sm">
                    <div className="px-2 whitespace-pre-line text-neutral-800 mb-0.5">
                        {commentData.content}
                    </div>

                    <div className="flex items-center text-xs">
                        {/* Vote */}
                        <p className="rounded-full text-neutral-700 bg-slate-200 flex items-center cursor-pointer z-[1]">
                            <span className="flex items-center">
                                <AuthButtonWrapper>
                                    <Button
                                        className={`!p-1.5 hover:[&_svg]:text-orange-600 ${
                                            commentData.upvotedBy.includes(
                                                userInfo?.username
                                            )
                                                ? "[&_svg]:text-orange-600"
                                                : ""
                                        }`}
                                        Icon={TbArrowBigUp}
                                        onClick={async (e) => {
                                            const target =
                                                e.currentTarget as HTMLElement;
                                            const span =
                                                target.nextElementSibling as HTMLElement;
                                            const status = await handleUpvote(
                                                commentData._id
                                            );
                                            if (!status) return;

                                            if (span) {
                                                span.innerText =
                                                    status?.newCount;
                                            }

                                            if (status.action === "added") {
                                                target.classList.add(
                                                    "[&_svg]:text-orange-600"
                                                );
                                            } else if (
                                                status.action === "removed"
                                            ) {
                                                target.classList.remove(
                                                    "[&_svg]:text-orange-600"
                                                );
                                            }
                                        }}
                                    ></Button>
                                </AuthButtonWrapper>
                                <span className="text-xs font-semibold">
                                    {commentData.upvotedBy.length}
                                </span>
                            </span>
                            <span className="pr-1.5 mr-1.5 border-r border-neutral-500 h-4"></span>
                            <span className="flex items-center">
                                <span className="text-xs font-semibold">
                                    {commentData.downvotedBy.length}
                                </span>
                                <AuthButtonWrapper>
                                    <Button
                                        className={`!p-1.5 hover:[&_svg]:text-purple-600 ${
                                            commentData.downvotedBy.includes(
                                                userInfo?.username
                                            )
                                                ? "[&_svg]:text-purple-600"
                                                : ""
                                        }`}
                                        Icon={TbArrowBigDown}
                                        onClick={async (e) => {
                                            const target =
                                                e.currentTarget as HTMLElement;
                                            const span =
                                                target.previousElementSibling as HTMLElement;
                                            const status = await handleDownvote(
                                                commentData._id
                                            );
                                            if (!status) return;

                                            if (span) {
                                                span.innerText =
                                                    status?.newCount;
                                            }

                                            if (status.action === "added") {
                                                target.classList.add(
                                                    "[&_svg]:text-purple-600"
                                                );
                                            } else if (
                                                status.action === "removed"
                                            ) {
                                                target.classList.remove(
                                                    "[&_svg]:text-purple-600"
                                                );
                                            }
                                        }}
                                    ></Button>
                                </AuthButtonWrapper>
                            </span>
                        </p>

                        <RoundedButton className="!px-3">
                            <FaRegComment className="text-base" />
                            <span className="font-semibold text-neutral-500 pl-2 z-[1]">
                                Reply
                            </span>
                        </RoundedButton>

                        <Popover
                            position="bottom"
                            axis="left"
                            className="text-base rounded-xl overflow-hidden"
                            indicator={false}
                            content={
                                <div className="min-w-36">
                                    {userInfo?.username ===
                                        commentData.author.username && (
                                        <>
                                            <SquareButton
                                                className="w-full"
                                                Icon={FiEdit3}
                                                onClick={(e) =>
                                                    handleUpdateComment(
                                                        commentData._id,
                                                        commentData.content
                                                    )
                                                }
                                            >
                                                Edit Comment
                                            </SquareButton>
                                            <SquareButton
                                                className="w-full"
                                                Icon={AiOutlineDelete}
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        commentData._id
                                                    )
                                                }
                                                disabled={
                                                    isDeleteCommentLoading
                                                }
                                            >
                                                Delete Comment
                                            </SquareButton>
                                        </>
                                    )}

                                    {userInfo?.username !==
                                        commentData.author.username && (
                                        <>
                                            <SquareButton
                                                className="w-full"
                                                Icon={IoFlagOutline}
                                                onClick={() =>
                                                    handleReportComment(
                                                        commentData._id
                                                    )
                                                }
                                            >
                                                Report
                                            </SquareButton>
                                        </>
                                    )}
                                </div>
                            }
                        >
                            <RoundedButton
                                className={`!px-2 ${
                                    isDeleteCommentLoading
                                        ? "pointer-events-none"
                                        : ""
                                }`}
                            >
                                <HiOutlineDotsHorizontal className="text-neutral-500 text-sm z-[1]" />
                            </RoundedButton>
                        </Popover>
                    </div>
                </div>
            </summary>

            {/* The Link to the Post. Active only in User Profile preview */}
            {commentData.postId && commentData.postTitle && (
                <Link
                    href={`/posts/${commentData.postId}`}
                    className="absolute inset-0"
                ></Link>
            )}
        </article>
    );
};

export default PreviewComment;
