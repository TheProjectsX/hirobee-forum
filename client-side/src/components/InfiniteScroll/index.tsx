"use client";

import React, { HTMLAttributes, useEffect, useRef } from "react";

const InfiniteScroll = ({
    children,
    className,
    ...options
}: HTMLAttributes<HTMLElement>) => {
    const indicatorRef = useRef<HTMLDivElement | null>(null);

    // Check Scroll
    // useEffect(() => {
    //     const handleScroll = (e: any) => {
    //         console.log(e);

    //         const rect = indicatorRef.current?.getBoundingClientRect();

    //         if (!rect) return;

    //         const isVisible =
    //             rect.top >= 0 &&
    //             rect.left >= 0 &&
    //             rect.bottom <= window.innerHeight &&
    //             rect.right <= window.innerWidth;

    //         if (isVisible) {
    //             console.log("Scrolled to Bottom");
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);

    return (
        <div
            data-name="infinite-scroll-wrapper"
            className={`${className ?? ""}`}
            {...options}
        >
            {children}

            <div ref={indicatorRef} className="w-full h-1"></div>
        </div>
    );
};

export default InfiniteScroll;
