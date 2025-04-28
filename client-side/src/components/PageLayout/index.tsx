import React, { HTMLAttributes } from "react";

let global__breakpoint: string;
let global__wrap: boolean;

const PageLayout = ({
    children,
    className = "",
    breakpoint = "950px",
    wrap = false,
    ...options
}: HTMLAttributes<HTMLDivElement> & {
    breakpoint?: "950px" | "770px";
    wrap?: boolean;
}) => {
    global__breakpoint = breakpoint;
    global__wrap = wrap;

    return (
        <div
            data-name="Page Layout Parent"
            className={`relative grid overflow-visible grid-cols-[1fr_320px] gap-6 w-full max-width mx-auto px-3 pt-3 ${
                wrap
                    ? global__breakpoint === "770px"
                        ? "max-[770px]:grid-rows-2 max-[770px]:grid-cols-2"
                        : "max-[950px]:grid-rows-2 max-[950px]:grid-cols-2"
                    : global__breakpoint === "770px"
                    ? "max-[770px]:grid-cols-1"
                    : "max-[950px]:grid-cols-1"
            } ${className}`}
            {...options}
        >
            {children}
        </div>
    );
};

export const MainDiv = ({
    children,
    className = "",
    ...options
}: HTMLAttributes<HTMLElement>) => {
    return (
        <main className={`grow ${className}`} {...options}>
            {children}
        </main>
    );
};

export const Sidebar = ({
    children,

    className = "",
    breakpoint = "950px",
    wrap = false,
    ...options
}: HTMLAttributes<HTMLElement> & {
    breakpoint?: "950px" | "770px";
    wrap?: boolean;
}) => {
    return (
        <aside
            className={`sticky top-[65px] max-h-[calc(100vh-65px)] overflow-y-auto scrollbar-track-transparent scrollbar-thumb-transparent scrollbar-thin hover:scrollbar-thumb-neutral-500/50 shrink-0
                ${
                    global__wrap
                        ? ""
                        : global__breakpoint === "770px"
                        ? "max-[770px]:hidden"
                        : "max-[950px]:hidden"
                }
            ${className}
          `}
            {...options}
        >
            {children}
        </aside>
    );
};

export default PageLayout;
