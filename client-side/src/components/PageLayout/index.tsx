import React, { HTMLAttributes } from "react";

const PageLayout = ({
    children,
    className = "",
    ...options
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={`flex gap-6 w-full h-full max-width mx-auto px-5 pt-3 ${className}`}
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
    ...options
}: HTMLAttributes<HTMLElement>) => {
    return (
        <aside
            className={`w-[300px] shrink-0 hidden min-[950px]:block ${className}`}
            {...options}
        >
            {children}
        </aside>
    );
};

export default PageLayout;
