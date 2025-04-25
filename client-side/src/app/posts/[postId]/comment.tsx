import RoundedButton from "@/components/Buttons/Rounded";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";

import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export interface CommentInterface {
    _id: string;
    content: string;
    upvotedBy: Array<string>;
    downvotedBy: Array<string>;
    createdAt: number;
    updatedAt: number;
    author: {
        username: string;
        profile_picture: string;
    };
}

const Comment = ({ commentData }: { commentData: CommentInterface }) => {
    return (
        <article className="py-3">
            {/* User Info */}
            <div className="flex items-center text-xs mb-1.5">
                <Link
                    href={`/u/${commentData.author.username}`}
                    className="mr-2"
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

                <Link href={`/u/${commentData.author.username}`}>
                    <span className="font-semibold underline-offset-4 hover:underline">
                        u/{commentData.author.username}
                    </span>
                </Link>
                <span className="text-neutral-500 mx-2">•</span>
                <span
                    className="text-neutral-500"
                    title={new Date(commentData.createdAt).toString()}
                >
                    {formatDistanceToNow(new Date(commentData.createdAt), {
                        addSuffix: true,
                    })}
                </span>
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
                            <RoundedButton className="!p-2 hover:text-orange-600">
                                <TbArrowBigUp className="text-base" />
                            </RoundedButton>
                            <span className="font-semibold text-neutral-500">
                                {commentData.upvotedBy.length}
                            </span>
                            <RoundedButton className="!p-2 hover:text-purple-600">
                                <TbArrowBigDown className="text-base" />
                            </RoundedButton>
                        </p>

                        <RoundedButton className="!px-3">
                            <FaRegComment className="text-base" />
                            <span className="font-semibold text-neutral-500 pl-2">
                                Reply
                            </span>
                        </RoundedButton>

                        <RoundedButton className="!px-2">
                            <HiOutlineDotsHorizontal className="text-neutral-500 text-sm" />
                        </RoundedButton>
                    </div>
                </div>
            </summary>
        </article>
    );
};

export default Comment;
