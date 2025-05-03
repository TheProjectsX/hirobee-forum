import React from "react";
import { Carousel } from "flowbite-react";
import {
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const GalleryCarousel = ({ images }: { images: Array<string> }) => {
    return (
        <div className="rounded-3xl overflow-hidden [&_div]:scrollbar-none">
            <Carousel
                slide={false}
                leftControl={
                    <p className="text-white bg-black/40 hover:bg-black/60 rounded-full p-0.5 text-3xl cursor-pointer">
                        <MdOutlineKeyboardArrowLeft />
                    </p>
                }
                rightControl={
                    <p className="text-white bg-black/40 hover:bg-black/60 rounded-full p-0.5 text-3xl cursor-pointer">
                        <MdOutlineKeyboardArrowRight />
                    </p>
                }
            >
                {images.map((image, idx) => (
                    <div
                        className="flex justify-center relative overflow-hidden"
                        key={idx}
                    >
                        <img
                            src={image}
                            alt="Image"
                            className="absolute left-0 top-0 h-full w-full object-cover opacity-30 scale-[1.2] blur-[24px]"
                            loading="lazy"
                        />
                        <img
                            src={image}
                            alt="Image"
                            className="max-h-[540px]"
                            loading="lazy"
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default GalleryCarousel;
