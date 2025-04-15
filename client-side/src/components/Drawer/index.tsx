import React from "react";
import Button from "../Button";
import { RiMenuLine } from "react-icons/ri";
import {
    MdArrowBackIosNew,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const Drawer = ({
    children,
    drawerOpened,
    setDrawerOpened,
}: {
    children: React.ReactNode;
    drawerOpened: boolean;
    setDrawerOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div
            style={
                {
                    "--drawer-size": "275px",
                    "--expand-visible": "35px",
                } as React.CSSProperties
            }
            className={`relative h-full flex`}
        >
            {/* Drawer */}
            <div
                className={`relative transition-[width] ease-in-out duration-300 delay-100 h-full z-10 ${
                    drawerOpened
                        ? "w-0 lg:w-[var(--drawer-size)]"
                        : "w-0 lg:w-[var(--expand-visible)]"
                }`}
            >
                {/* Drawer Content */}
                <div
                    className={`h-full bg-white transition-[translate] ease-in-out duration-300 delay-100 border-r border-neutral-300 ${
                        drawerOpened
                            ? ""
                            : "-translate-x-[var(--drawer-size)] lg:-translate-x-[calc(var(--drawer-size)-var(--expand-visible))]"
                    }`}
                    style={{ width: "var(--drawer-size)" }}
                >
                    Content
                </div>
                {/* Controller */}
                <Button
                    className={`absolute top-5 -right-4 bg-white border border-neutral-400 !px-1.5 !py-1.5 hidden lg:block`}
                    onClick={(e) => setDrawerOpened((prev) => !prev)}
                >
                    {drawerOpened ? (
                        <MdKeyboardDoubleArrowLeft className="text-lg" />
                    ) : (
                        <MdKeyboardDoubleArrowRight className="text-lg" />
                    )}
                </Button>
            </div>

            {/* Content */}
            <div className="grow relative">
                {children}

                {/* Black cover for Drawer */}
                <div
                    className={`absolute inset-0 bg-black/10 ${
                        drawerOpened ? "lg:hidden" : "hidden"
                    }`}
                    onClick={() => setDrawerOpened(false)}
                ></div>
            </div>
        </div>
    );
};

export default Drawer;
