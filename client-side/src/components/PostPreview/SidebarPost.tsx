import Link from "next/link";
import React from "react";

const SidebarPost = () => {
    const images = ["https://placehold.co/403"];

    return (
        <article className="bg-slate-100/80 py-3.5">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <header className="mb-1">
                        <Link
                            href={"/r/"}
                            className="flex gap-2 items-center z-[1]"
                        >
                            <span className="w-6 h-6 rounded-full overflow-hidden">
                                <img
                                    src="https://placehold.co/24"
                                    alt="SubHiro Picture"
                                    className="w-full h-full"
                                    loading="lazy"
                                />
                            </span>
                            <span className="hover:underline font-this text-xs text-neutral-800">
                                r/ChatGPT
                            </span>
                        </Link>
                    </header>

                    <Link
                        href={"/"}
                        className="line-clamp-2 text-sm text-neutral-500 mb-4 font-medium underline-offset-4 hover:underline"
                    >
                        Here lies a title
                    </Link>
                </div>
                {images && images.length > 0 && (
                    <div className="w-[84px] h-[84px] rounded-lg overflow-hidden">
                        <img
                            src={images[0]}
                            alt="Image preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            <p className="text-xs text-neutral-500 flex gap-1 items-center">
                <span>543 upvotes</span>
                <span>•</span>
                <span>17 comments</span>
            </p>
        </article>
    );
};

export default SidebarPost;
