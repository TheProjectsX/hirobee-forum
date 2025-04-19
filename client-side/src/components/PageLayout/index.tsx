import React, { HTMLAttributes } from "react";

const PageLayout = ({
    children,
    className = "",
    ...options
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={`flex gap-6 w-full h-full max-width mx-auto px-3 pt-3 ${className}`}
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
    breakpoint = "950px",
    className = "",
    ...options
}: HTMLAttributes<HTMLElement> & { breakpoint?: "950px" | "770px" }) => {
    return (
        <aside
            className={`w-[320px] shrink-0 hidden ${
                breakpoint === "770px"
                    ? "min-[770px]:block"
                    : "min-[950px]:block"
            } ${className}`}
            {...options}
        >
            {children}
        </aside>
    );
};

export default PageLayout;
