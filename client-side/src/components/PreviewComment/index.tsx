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
    useUpdateCommentMutation,
} from "@/store/features/comments/commentsApiSlice";
import { useSelector } from "react-redux";

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
    const [reportComment] = useReportCommentMutation();

    // Upvote Comment

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
                    href={`/u/${commentData.author.username}`}
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
                    href={`/u/${commentData.author.username}`}
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
                        <p className="flex items-center">
                            <RoundedButton className="!p-2 hover:text-orange-600 z-[1]">
                                <TbArrowBigUp className="text-base" />
                            </RoundedButton>
                            <span className="font-semibold text-neutral-500">
                                {commentData.upvotedBy.length}
                            </span>
                            <RoundedButton className="!p-2 hover:text-purple-600 z-[1]">
                                <TbArrowBigDown className="text-base" />
                            </RoundedButton>
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
