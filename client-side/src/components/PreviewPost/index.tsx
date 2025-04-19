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

const PreviewPost = ({
    fullPreview = false,
    className = "",
}: {
    fullPreview?: boolean;
    className?: string;
}) => {
    const images: Array<string> = [];

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
                    <div className="flex items-center gap-2">
                        <Link
                            href={"/h/someid"}
                            className="flex gap-1.5 items-center z-[1]"
                        >
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
                )}
                {fullPreview && (
                    <div className="flex items-center gap-2 mb-1.5">
                        <Link href={"/h/someid"}>
                            <Button
                                Icon={MdArrowBack}
                                className="!p-1.5 [&_svg]:text-xl"
                            ></Button>
                        </Link>
                        <Link
                            href={"/h/someid"}
                            className="flex gap-1.5 items-center z-[1] h-full"
                        >
                            <span className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                    src="https://placehold.co/32"
                                    alt="SubHiro Picture"
                                    className="w-full h-full"
                                    loading="lazy"
                                />
                            </span>
                        </Link>
                        <div>
                            <p className="flex items-center gap-1">
                                <Link href={"/h/someid"}>
                                    <span className="hover:text-blue-800 font-medium">
                                        r/ChatGPT
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
                            <Link
                                href={"/user/"}
                                className="font-this text-neutral-600 hover:text-blue-800"
                            >
                                SomeUserFrom1999
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 justify-end">
                    <Popover
                        position="bottom"
                        axis="right"
                        className="text-base rounded-xl overflow-hidden"
                        indicator={false}
                        content={
                            <div className="min-w-36">
                                <SquareButton className="w-full" Icon={GoBell}>
                                    Follow Post
                                </SquareButton>

                                <SquareButton
                                    className="w-full"
                                    Icon={BsBookmark}
                                >
                                    Save
                                </SquareButton>
                                <SquareButton
                                    className="w-full"
                                    Icon={IoEyeOffOutline}
                                >
                                    Hide
                                </SquareButton>
                                <SquareButton
                                    className="w-full"
                                    Icon={IoFlagOutline}
                                >
                                    Report
                                </SquareButton>
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
                    What to do if I am Home sick?
                </h3>
                <p
                    className={`text-sm text-neutral-700 whitespace-pre-line ${
                        fullPreview ? "mb-4" : "mb-3 line-clamp-4"
                    }`}
                >
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

            {/* Content Control Buttons */}
            <div className="flex items-center gap-2">
                <p className="rounded-full text-neutral-700 bg-slate-200 flex items-center cursor-pointer z-[1]">
                    <Button
                        className="!p-1.5 hover:[&_svg]:text-orange-600"
                        Icon={TbArrowBigUp}
                    ></Button>
                    <span className="text-xs font-semibold">310</span>
                    <Button
                        className="!p-1.5 hover:[&_svg]:text-purple-600"
                        Icon={TbArrowBigDown}
                    ></Button>
                </p>
                <Button Icon={FaRegComment} className="z-[1]">
                    310
                </Button>
                <Button Icon={SlBadge} className="z-[1]"></Button>

                <Popover
                    position="bottom"
                    axis="left"
                    className="text-base rounded-xl overflow-hidden"
                    indicator={false}
                    content={
                        <div className="min-w-36">
                            <SquareButton className="w-full" Icon={IoIosLink}>
                                Copy Link
                            </SquareButton>

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
                    href={"/posts/someid"}
                    className="absolute inset-0"
                ></Link>
            )}
        </article>
    );
};

export default PreviewPost;
