import RoundedButton from "@/components/Buttons/Rounded";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";

import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Comment = () => {
    return (
        <article className="py-3">
            {/* User Info */}
            <div className="flex items-center text-xs mb-1.5">
                <Link href={"/u/"} className="mr-2">
                    <figure className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                            src="https://placehold.co/32"
                            alt="Profile Picture"
                            loading="lazy"
                            className="w-full h-full"
                        />
                    </figure>
                </Link>

                <Link href={"/u/"}>
                    <span className="font-semibold underline-offset-4 hover:underline">
                        SomeOneFromFuture19991
                    </span>
                </Link>
                <span className="text-neutral-500 mx-2">•</span>
                <span
                    className="text-neutral-500"
                    title={new Date(1744814420921).toString()}
                >
                    {formatDistanceToNow(new Date(1744814420921), {
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
                        What's up? Lorem ipsum dolor sit amet consectetur
                        adipisicing elit.
                        {"\n\n"}
                        Sed corporis velit laboriosam minus neque laudantium
                        asperiores itaque iste esse exercitationem, voluptatem
                        ipsa alias sequi dolorem ad ut iusto veritatis delectus
                        fuga dolorum blanditiis quam? Quaerat illo repellendus
                        eum nostrum assumenda. Dolore modi blanditiis nobis!
                    </div>

                    <div className="flex items-center text-xs">
                        <p className="flex items-center">
                            <RoundedButton className="!p-2 hover:text-orange-600">
                                <TbArrowBigUp className="text-base" />
                            </RoundedButton>
                            <span className="font-semibold text-neutral-500">
                                10
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
