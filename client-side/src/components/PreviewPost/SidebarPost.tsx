import Link from "next/link";
import React from "react";
import { PostInterface } from ".";

const SidebarPost = ({ postData }: { postData: PostInterface }) => {
    return (
        <article className="bg-slate-100/80 py-3.5">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <header className="mb-1">
                        <Link
                            href={
                                postData.subhiro?.hironame
                                    ? `/subhiro/${postData.subhiro.hironame}`
                                    : `/user/${postData.author.username}`
                            }
                            className="flex gap-2 items-center z-[1]"
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
                            <span className="hover:underline font-this text-xs text-neutral-800">
                                {postData.subhiro?.hironame
                                    ? `h/${postData.subhiro.hironame}`
                                    : `u/${postData.author.username}`}
                            </span>
                        </Link>
                    </header>

                    <Link
                        href={`/posts/${postData._id}`}
                        className="line-clamp-2 text-sm text-neutral-500 mb-4 font-medium underline-offset-4 hover:underline"
                    >
                        {postData.title}
                    </Link>
                </div>
                {postData.images && postData.images.length > 0 && (
                    <div className="w-[84px] h-[84px] rounded-lg overflow-hidden">
                        <img
                            src={postData.images[0]}
                            alt="Image preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            <p className="text-xs text-neutral-500 flex gap-1 items-center">
                <span>{postData.upvotedBy.length} upvotes</span>
                <span>•</span>
                <span>{postData.commentsCount} comments</span>
            </p>
        </article>
    );
};

export default SidebarPost;
