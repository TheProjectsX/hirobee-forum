import Link from "next/link";
import React from "react";

const Highlights = ({ images = [] }: { images?: Array<string> }) => {
    return (
        <Link
            href={"/posts/someid"}
            className="px-3 py-2 rounded-2xl border border-neutral-300 flex items-center gap-2 hover:bg-slate-100"
        >
            {images && images.length > 0 && (
                <div className="w-24 h-24 shrink-0 flex items-center justify-center overflow-hidden rounded-2xl">
                    <img
                        src={images[0]}
                        alt="Some Image!"
                        className="w-full h-full"
                    />
                </div>
            )}
            <div className={``}>
                <h2 className="line-clamp-2 font-medium">
                    Lorem, ipsum dolor sit amet conse ctetur adipisicing elit.
                    Eos repreh enderit dolores, quae placeat quod reiciendis
                    accusantium nesciunt sequi rem saepe quo, sunt soluta
                    officiis eius ex labore cumque in amet porro ipsa?
                </h2>
                <p className="text-xs text-neutral-500 flex items-center gap-1 mb-1.5">
                    <span>44 votes</span>
                    <span>•</span>
                    <span>120 comments</span>
                </p>

                {/* Tag */}
                <p className="text-sm font-medium">Announcement</p>
            </div>
        </Link>
    );
};

export default Highlights;
