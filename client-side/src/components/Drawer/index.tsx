import React from "react";
import Button from "../Button";
import { RiMenuLine } from "react-icons/ri";
import { MdArrowBackIosNew } from "react-icons/md";

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
            <div className={`w-fit h-full relative`}>
                {/* Drawer Content */}
                <div
                    className={`overflow-hidden transition-all duration-300 border-r border-neutral-300 h-full ${
                        drawerOpened
                            ? "w-[var(--drawer-size)]"
                            : "w-[var(--expand-visible)]"
                    }`}
                    // style={{ width: "var(--drawer-size)" }}
                >
                    <div
                        className={`w-full h-full transition-opacity duration-200 ${
                            drawerOpened ? "delay-300 opacity-100" : "opacity-0"
                        }`}
                    >
                        Content
                    </div>
                </div>

                {/* Controller */}
                <Button
                    className="absolute top-5 -right-4 bg-white border border-neutral-400 !px-1.5 !py-1.5"
                    onClick={(e) => setDrawerOpened((prev) => !prev)}
                >
                    {drawerOpened ? (
                        <MdArrowBackIosNew className="text-lg" />
                    ) : (
                        <RiMenuLine className="text-lg" />
                    )}
                </Button>
            </div>

            {/* Content */}
            <div className="w-full">{children}</div>
        </div>
    );
};

export default Drawer;
