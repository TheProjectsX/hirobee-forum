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
            className={`flex gap-6 w-full h-full max-width mx-auto px-3 pt-3 ${
                wrap
                    ? global__breakpoint === "770px"
                        ? "max-[770px]:flex-col"
                        : "max-[950px]:flex-col"
                    : ""
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
            className={`max-h-full overflow-y-auto scrollbar-track-transparent scrollbar-thumb-transparent scrollbar-thin hover:scrollbar-thumb-neutral-500/50 shrink-0 w-[320px]
            ${
                global__breakpoint === "770px"
                    ? "min-[770px]:block"
                    : "min-[950px]:block"
            }
            ${global__wrap ? "block" : "hidden"}
            ${
                global__wrap &&
                (global__breakpoint === "770px"
                    ? "max-[770px]:w-full"
                    : "max-[950px]:w-full")
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
