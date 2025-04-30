"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { FaRegComment } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";
import { RiShareForwardLine } from "react-icons/ri";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import { GoBell } from "react-icons/go";
import { BsBookmark } from "react-icons/bs";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoFlagOutline } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import { TbArrowsCross } from "react-icons/tb";
import { ImEmbed2 } from "react-icons/im";

import GalleryCarousel from "../GalleryCarousel";
import RoundedButton from "../Buttons/Rounded";
import SquareButton from "../Buttons/Square";
import Popover from "../Popover";
import Button from "./Button";
import { MdArrowBack } from "react-icons/md";
import Clipboard from "../Clipboard";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { useDeletePostMutation } from "@/store/features/user/userApiSlice";
import {
    useReportPostMutation,
    useUpdatePostDownvoteMutation,
    useUpdatePostUpvoteMutation,
} from "@/store/features/posts/postsApiSlice";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AuthButtonWrapper from "../AuthButtonWrapper";

export interface PostInterface {
    _id: string;
    title: string;
    content: string;
    images: Array<string> | null;
    upvotedBy: Array<string>;
    downvotedBy: Array<string>;
    createdAt: number;
    updatedAt: number;
    commentsCount: number;
    author: {
        username: string;
        profile_picture: string;
    };
    subhiro: {
        hironame: string | null;
        profile_picture: string | null;
    };
}

const PreviewPost = ({
    fullPreview = false,
    className = "",
    postData,
    onDelete = () => {},
}: {
    fullPreview?: boolean;
    postData: PostInterface;
    className?: string;
    onDelete?: () => void;
}) => {
    const {
        data: userInfo,
        isLoading: isUserInfoLoading,
        isError: isUserInfoError,
        isSuccess: isUserInfoSuccess,
    } = useSelector((state: any) => state.user_info);

    const [updateUpvote] = useUpdatePostUpvoteMutation();
    const [updateDownvote] = useUpdatePostDownvoteMutation();
    const [reportPost] = useReportPostMutation();

    const [deletePost, { isLoading: isDeletePostLoading }] =
        useDeletePostMutation();

    const router = useRouter();

    // Private Route
    const handleUpvote = async () => {
        if (!isUserInfoLoading && isUserInfoError) {
            return;
        }

        try {
            const response = await updateUpvote({
                postId: postData._id,
            }).unwrap();
            return { newCount: response.newCount, action: response.action };
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Update Vote");
        }
    };

    // Private Route
    const handleDownvote = async () => {
        if (!isUserInfoLoading && isUserInfoError) {
            return;
        }

        try {
            const response = await updateDownvote({
                postId: postData._id,
            }).unwrap();
            return { newCount: response.newCount, action: response.action };
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Update Vote");
        }
    };

    // Private Route (Only for Author)
    const handleDeletePost = async (postId: string) => {
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
            const response = await deletePost({ postId }).unwrap();
            router.push("/");
            toast.success("Post Deleted!");
            onDelete();
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Delete Post");
        }
    };

    // Report Post
    const handleReportPost = async (postId: string) => {
        if (!isUserInfoLoading && isUserInfoError) {
            return;
        }

        const result = await Swal.fire({
            title: "Select your Report",
            input: "select",
            inputOptions: {
                "Spam or self-promotion": "Spam or self-promotion",
                "Offensive language": "Offensive language",
                "NSFW content": "NSFW content",
                "Harassment or bullying": "Harassment or bullying",
                Misinformation: "Misinformation",
            },
            inputPlaceholder: "Select a Report",
            showCancelButton: true,
        });

        if (result.isDismissed) return;

        try {
            const data = {
                postId,
                body: { report: result.value },
            };
            await reportPost(data).unwrap();

            toast.success("Successfully Reported Post");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Failed to Send Report");
        }
    };

    return (
        <article
            className={`py-1.5 rounded-2xl relative ${
                fullPreview ? "" : "hover:bg-slate-100 px-3"
            } ${className ?? ""}`}
        >
            <header
                className={`flex  justify-between gap-2 text-xs ${
                    fullPreview ? "items-start" : "items-center"
                }`}
            >
                {!fullPreview && (
                    <div className="flex items-center gap-1.5">
                        <Link
                            href={
                                postData.subhiro?.hironame
                                    ? `/h/${postData.subhiro.hironame}`
                                    : `/u/${postData.author.username}`
                            }
                            className="flex gap-1.5 items-center z-[1]"
                        >
                            <span className="w-6 h-6 rounded-full overflow-hidden">
                                <img
                                    src={
                                        postData.subhiro?.profile_picture
                                            ? `${postData.subhiro.profile_picture}`
                                            : `${postData.author.profile_picture}`
                                    }
                                    alt="SubHiro OR User Picture"
                                    className="w-full h-full"
                                    loading="lazy"
                                />
                            </span>
                            <span className="hover:text-blue-800 font-medium text-sm">
                                {postData.subhiro?.hironame
                                    ? `h/${postData.subhiro.hironame}`
                                    : `u/${postData.author.username}`}
                            </span>
                        </Link>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-500">
                            {formatDistanceToNow(new Date(postData.createdAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                )}
                {fullPreview && (
                    <div className="flex items-center gap-2 mb-1.5">
                        {postData.subhiro?.hironame && (
                            <Link href={`/h/${postData.subhiro.hironame}`}>
                                <Button
                                    Icon={MdArrowBack}
                                    className="!p-1.5 [&_svg]:text-xl"
                                ></Button>
                            </Link>
                        )}

                        <Link
                            href={
                                postData.subhiro?.hironame
                                    ? `/h/${postData.subhiro.hironame}`
                                    : `/u/${postData.author.username}`
                            }
                            className="flex gap-1.5 items-center z-[1] h-full"
                        >
                            <span className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src={
                                        postData.subhiro?.profile_picture
                                            ? `${postData.subhiro.profile_picture}`
                                            : `${postData.author.profile_picture}`
                                    }
                                    alt="SubHiro OR User Picture"
                                    className="w-full h-full"
                                    loading="lazy"
                                />
                            </span>
                        </Link>
                        <div>
                            <p className="flex items-center gap-1">
                                <Link
                                    href={
                                        postData.subhiro?.hironame
                                            ? `/h/${postData.subhiro.hironame}`
                                            : `/u/${postData.author.username}`
                                    }
                                >
                                    <span className="hover:text-blue-800 font-medium text-sm">
                                        {postData.subhiro?.hironame
                                            ? `h/${postData.subhiro.hironame}`
                                            : `u/${postData.author.username}`}
                                    </span>
                                </Link>
                                <span className="text-neutral-500">•</span>
                                <span className="text-neutral-500">
                                    {formatDistanceToNow(
                                        new Date(1744814420921),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </span>
                            </p>
                            {postData.subhiro?.hironame && (
                                <Link
                                    href={`/u/${postData.author.username}`}
                                    className="font-this text-neutral-600 hover:text-blue-800"
                                >
                                    u/{postData.author.username}
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 justify-end">
                    {/* TODO: Add Actions */}
                    <Popover
                        position="bottom"
                        axis="right"
                        className="text-base rounded-xl overflow-hidden"
                        indicator={false}
                        content={
                            <div className="min-w-36">
                                <SquareButton
                                    className="w-full"
                                    Icon={BsBookmark}
                                >
                                    Save
                                </SquareButton>

                                {userInfo?.username ===
                                    postData.author.username && (
                                    <>
                                        <Link
                                            href={`/posts/submit?postId=${postData._id}`}
                                        >
                                            <SquareButton
                                                className="w-full"
                                                Icon={FiEdit3}
                                            >
                                                Edit Post
                                            </SquareButton>
                                        </Link>
                                        <SquareButton
                                            className="w-full"
                                            Icon={AiOutlineDelete}
                                            onClick={() =>
                                                handleDeletePost(postData._id)
                                            }
                                            disabled={isDeletePostLoading}
                                        >
                                            Delete Post
                                        </SquareButton>
                                    </>
                                )}
                                {userInfo?.username !==
                                    postData.author.username && (
                                    <>
                                        <SquareButton
                                            className="w-full"
                                            Icon={GoBell}
                                        >
                                            Follow Post
                                        </SquareButton>

                                        <SquareButton
                                            className="w-full"
                                            Icon={IoEyeOffOutline}
                                        >
                                            Hide
                                        </SquareButton>
                                        <AuthButtonWrapper>
                                            <SquareButton
                                                className="w-full"
                                                Icon={IoFlagOutline}
                                                onClick={() =>
                                                    handleReportPost(
                                                        postData._id
                                                    )
                                                }
                                            >
                                                Report
                                            </SquareButton>
                                        </AuthButtonWrapper>
                                    </>
                                )}
                            </div>
                        }
                    >
                        <RoundedButton className="z-[1]">
                            <HiOutlineDotsHorizontal className="text-lg" />
                        </RoundedButton>
                    </Popover>
                </div>
            </header>

            {/* The Content */}
            <div className="">
                <h3
                    className={`${
                        fullPreview
                            ? "text-lg md:text-2xl mb-2 font-semibold"
                            : "text-lg mb-0.5 font-medium"
                    }`}
                >
                    {postData.title}
                </h3>
                <div
                    className={`text-sm text-neutral-700 whitespace-pre-line ${
                        fullPreview ? "mb-4" : "mb-3 line-clamp-4"
                    }`}
                >
                    {postData.content}
                </div>

                {/* Images */}
                {postData.images && postData.images.length > 0 && (
                    <div className="w-full pt-3">
                        <GalleryCarousel images={postData.images} />
                    </div>
                )}
            </div>

            {/* Content Control Buttons */}
            <div className="flex items-center gap-2">
                <p className="rounded-full text-neutral-700 bg-slate-200 flex items-center cursor-pointer z-[1]">
                    <span className="flex items-center">
                        <Button
                            className={`!p-1.5 hover:[&_svg]:text-orange-600 ${
                                postData.upvotedBy.includes(userInfo?.username)
                                    ? "[&_svg]:text-orange-600"
                                    : ""
                            }`}
                            Icon={TbArrowBigUp}
                            onClick={async (e) => {
                                const target = e.currentTarget as HTMLElement;
                                const span =
                                    target.nextElementSibling as HTMLElement;
                                const status = await handleUpvote();
                                if (!status) return;

                                if (span) {
                                    span.innerText = status?.newCount;
                                }

                                if (status.action === "added") {
                                    target.classList.add(
                                        "[&_svg]:text-orange-600"
                                    );
                                } else if (status.action === "removed") {
                                    target.classList.remove(
                                        "[&_svg]:text-orange-600"
                                    );
                                }
                            }}
                        ></Button>
                        <span className="text-xs font-semibold">
                            {postData.upvotedBy.length}
                        </span>
                    </span>
                    <span className="pr-1.5 mr-1.5 border-r border-neutral-500 h-4"></span>
                    <span className="flex items-center">
                        <span className="text-xs font-semibold">
                            {postData.downvotedBy.length}
                        </span>
                        <Button
                            className={`!p-1.5 hover:[&_svg]:text-purple-600 ${
                                postData.downvotedBy.includes(
                                    userInfo?.username
                                )
                                    ? "[&_svg]:text-purple-600"
                                    : ""
                            }`}
                            Icon={TbArrowBigDown}
                            onClick={async (e) => {
                                const target = e.currentTarget as HTMLElement;
                                const span =
                                    target.previousElementSibling as HTMLElement;
                                const status = await handleDownvote();
                                if (!status) return;

                                if (span) {
                                    span.innerText = status?.newCount;
                                }

                                if (status.action === "added") {
                                    target.classList.add(
                                        "[&_svg]:text-purple-600"
                                    );
                                } else if (status.action === "removed") {
                                    target.classList.remove(
                                        "[&_svg]:text-purple-600"
                                    );
                                }
                            }}
                        ></Button>
                    </span>
                </p>
                <Button Icon={FaRegComment} className="z-[1]">
                    {postData.commentsCount}
                </Button>
                <Button Icon={SlBadge} className="z-[1]"></Button>

                <Popover
                    position="bottom"
                    axis="left"
                    className="text-base rounded-xl overflow-hidden"
                    indicator={false}
                    content={
                        <div className="min-w-36">
                            <Clipboard
                                value={`/posts/${postData._id}`}
                                onCopied={() => {
                                    toast.info("Copied!", { autoClose: 1000 });
                                }}
                            >
                                <SquareButton
                                    className="w-full"
                                    Icon={IoIosLink}
                                >
                                    Copy Link
                                </SquareButton>
                            </Clipboard>

                            <SquareButton
                                className="w-full"
                                Icon={TbArrowsCross}
                            >
                                Crosspost
                            </SquareButton>
                            <SquareButton className="w-full" Icon={ImEmbed2}>
                                Embed
                            </SquareButton>
                        </div>
                    }
                >
                    <Button Icon={RiShareForwardLine} className="z-[1]">
                        Share
                    </Button>
                </Popover>
            </div>

            {/* The Link to the Post. Active only in homepage preview */}
            {!fullPreview && (
                <Link
                    href={`/posts/${postData._id}`}
                    className="absolute inset-0"
                ></Link>
            )}
        </article>
    );
};

export default PreviewPost;
