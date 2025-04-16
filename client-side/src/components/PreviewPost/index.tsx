import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { FaRegComment } from "react-icons/fa";
import { SlBadge } from "react-icons/sl";
import { RiShareForwardLine } from "react-icons/ri";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import GalleryCarousel from "../GalleryCarousel";
import Button from "../Button";

const PreviewPost = () => {
    const images: Array<string> = [];

    return (
        <article className="px-3 py-1.5 rounded-2xl hover:bg-slate-100">
            <header className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <Link href={"/r/"} className="flex gap-1.5 items-center">
                        <span className="w-6 h-6 rounded-full overflow-hidden">
                            <img
                                src="https://placehold.co/24"
                                alt="SubHiro Picture"
                                className="w-full h-full"
                                loading="lazy"
                            />
                        </span>
                        <span className="hover:text-blue-800 font-medium">
                            r/ChatGPT
                        </span>
                    </Link>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-500">
                        {formatDistanceToNow(new Date(1744814420921), {
                            addSuffix: true,
                        })}
                    </span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                    <Button>
                        <HiOutlineDotsHorizontal className="text-lg" />
                    </Button>
                </div>
            </header>

            {/* The Hirobee */}
            <div className="mb-3">
                <h3 className="text-lg mb-0.5 font-medium">
                    What to do if I am Home sick?
                </h3>
                <p className="line-clamp-4 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Fugit reprehenderit quos sed illum vero dolore aliquam,
                    suscipit eius veritatis, vitae, laboriosam nostrum. Corrupti
                    natus dicta eos repellat, temporibus eaque adipisci a in, at
                    porro soluta debitis, ipsum tenetur asperiores excepturi
                    dolor iure? Voluptatum deleniti eaque tempore perspiciatis,
                    ullam vitae ipsa tenetur eligendi similique natus quibusdam
                    molestias omnis. Deleniti molestiae pariatur suscipit
                    cupiditate amet ipsum, natus sint quaerat illum nostrum,
                    dicta dolorem laudantium. Facilis, nobis dolorum dolores ad
                    nemo eaque officia blanditiis repellendus voluptatibus,
                    molestias voluptates quasi labore, praesentium laudantium
                    ipsam dignissimos minus porro ratione! Fugiat laudantium
                    obcaecati totam facere mollitia.
                </p>

                {/* Images */}
                {images && images.length > 0 && (
                    <div className="w-full pt-3">
                        <GalleryCarousel images={images} />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <p className="rounded-full text-neutral-700 bg-slate-200 flex items-center cursor-pointer">
                    <button className="rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 px-1.5 py-1.5 cursor-pointer hover:[&_svg]:text-orange-600">
                        <TbArrowBigUp className="text-lg" />
                    </button>
                    <span className="text-sm font-medium">310</span>
                    <button className="rounded-full bg-slate-200 hover:bg-slate-300 active:bg-slate-400 px-1.5 py-1.5 cursor-pointer hover:[&_svg]:text-purple-600">
                        <TbArrowBigDown className="text-lg" />
                    </button>
                </p>
                <p className="rounded-full px-3.5 py-1.5 text-neutral-700 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 flex items-center gap-1.5 cursor-pointer">
                    <FaRegComment className="text-lg" />
                    <span className="text-sm font-medium">310</span>
                </p>
                <p className="rounded-full px-3.5 py-1.5 text-neutral-700 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 flex items-center gap-1.5 cursor-pointer">
                    <SlBadge className="text-lg" />
                </p>
                <button className="rounded-full px-3.5 py-1.5 text-neutral-700 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 flex items-center gap-1.5 cursor-pointer">
                    <RiShareForwardLine className="text-lg" />
                    <span className="text-sm font-medium">Share</span>
                </button>
            </div>
        </article>
    );
};

export default PreviewPost;
