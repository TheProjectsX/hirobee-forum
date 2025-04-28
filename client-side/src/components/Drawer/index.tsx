"use client";

import React, { useEffect, useRef } from "react";
import RoundedButton from "../Buttons/Rounded";
import {
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
} from "react-icons/md";

interface DrawerProps {
    children: React.ReactNode;
    drawerContent: React.ReactNode;
    drawerOpened: boolean;
    onDrawerOpened: () => void;
    onDrawerClosed: () => void;
}

const Drawer = ({
    children,
    drawerContent,
    drawerOpened,
    onDrawerOpened,
    onDrawerClosed,
}: DrawerProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const top = wrapperRef.current?.getBoundingClientRect().top;
        if (top !== undefined) {
            wrapperRef.current!.style.setProperty(
                "--navbar-height",
                `${top}px`
            );
        }
    }, []);

    useEffect(() => {
        const handleScrollBlock = () => {
            document.body.style.overflow =
                window.innerWidth < 1024 && drawerOpened ? "hidden" : "auto";
        };

        handleScrollBlock();
        window.addEventListener("resize", handleScrollBlock);
        return () => window.removeEventListener("resize", handleScrollBlock);
    }, [drawerOpened]);

    return (
        <div
            ref={wrapperRef}
            style={
                {
                    "--drawer-size": "272px",
                    "--shrink-visible": "24px",
                } as React.CSSProperties
            }
            className={`relative h-full overflow-hidden grid transition-[grid-template-columns] ease-in-out duration-300 delay-100 grid-cols-[0px_1fr] ${
                drawerOpened
                    ? "lg:grid-cols-[var(--drawer-size)_1fr]"
                    : "lg:grid-cols-[var(--shrink-visible)_1fr]"
            }`}
        >
            {/* Drawer */}
            <div className="h-full z-20">
                <div
                    className={`fixed transition-[translate] ease-in-out duration-300 delay-100 border-r border-neutral-300 ${
                        drawerOpened
                            ? ""
                            : "-translate-x-[var(--drawer-size)] lg:-translate-x-[calc(var(--drawer-size)-var(--shrink-visible))]"
                    }`}
                >
                    <div
                        className={`h-[calc(100vh-var(--navbar-height,40px))] bg-white pl-4 pr-[var(--shrink-visible)] py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent ${
                            drawerOpened
                                ? "hover:scrollbar-thumb-neutral-500/50"
                                : ""
                        }`}
                        style={{ width: "var(--drawer-size)" }}
                    >
                        {drawerContent}
                    </div>

                    <RoundedButton
                        className="!absolute top-5 -right-4 bg-white border border-neutral-400 !px-1.5 !py-1.5 hidden lg:block"
                        onClick={drawerOpened ? onDrawerClosed : onDrawerOpened}
                    >
                        {drawerOpened ? (
                            <MdKeyboardDoubleArrowLeft className="text-lg" />
                        ) : (
                            <MdKeyboardDoubleArrowRight className="text-lg" />
                        )}
                    </RoundedButton>
                </div>
            </div>

            {/* Content */}
            <div className="grow relative">
                {children}

                {/* Black Cover */}
                {drawerOpened && (
                    <div
                        className="fixed inset-0 bg-black/20 z-10 overscroll-none touch-none lg:hidden"
                        onClick={onDrawerClosed}
                    />
                )}
            </div>
        </div>
    );
};

export default Drawer;
