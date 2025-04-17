"use client";

import React, { useEffect, useRef, useState } from "react";

const Popover = ({
    children,
    content,
    className = "",
    position = "bottom",
    axis = "center",
    indicator = true,
}: {
    children: React.ReactElement<any, any>;
    content?: string | React.ReactNode;
    className?: string;
    position?: "top" | "bottom" | "left" | "right";
    axis?: "top" | "bottom" | "left" | "right" | "center";
    indicator?: boolean;
}) => {
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [popoverStyle, setPopoverStyle] = useState<{
        content: {};
        indicator: {};
    }>({ content: {}, indicator: {} });

    const clonedTrigger = React.cloneElement(children, {
        ref: triggerRef,
        className: `${children.props.className || ""} peer`,
        "data-name": "popover-trigger",
        tabIndex: 0,
    });

    useEffect(() => {
        const gap = 10;
        const indicatorGap = 6;
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        const contentRect = contentRef.current?.getBoundingClientRect();

        const contentWidth = contentRect?.width ?? 0;
        const contentHeight = contentRect?.height ?? 0;
        const triggerWidth = triggerRect?.width ?? 0;
        const triggerHeight = triggerRect?.height ?? 0;

        const popoverContentStyles: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
        } = {};
        const popoverIndicatorStyles: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
        } = {};

        // Give Position
        const size =
            position === "top" || position === "bottom"
                ? triggerHeight ?? 0
                : triggerWidth ?? 0;

        const oppositeSide: Record<string, keyof typeof popoverContentStyles> =
            {
                top: "bottom",
                bottom: "top",
                left: "right",
                right: "left",
            };

        const windowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        let finalPosition = position;

        // Check if the Content goes outside the screen based on position
        /* Algo: x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight
            top: x = trigger.top - gap - content.height
            bottom: x = trigger.bottom + gap + content.height
            left: y = trigger.left - gap - content.width
            right: y = trigger.right + gap + content.width
        */
        if (
            (position === "top" &&
                (triggerRect?.top ?? 0) - gap - contentHeight < 0) ||
            (position === "bottom" &&
                (triggerRect?.bottom ?? 0) + gap + contentHeight >
                    windowSize.height) ||
            (position === "left" &&
                (triggerRect?.left ?? 0) - gap - contentWidth < 0) ||
            (position === "right" &&
                (triggerRect?.right ?? 0) + gap + contentWidth < 0)
        ) {
            finalPosition = oppositeSide[position];
        }

        popoverIndicatorStyles[oppositeSide[finalPosition]] = `${
            indicatorGap * -1
        }px`;
        popoverContentStyles[oppositeSide[finalPosition]] = `${size + gap}px`;

        // Give Axis
        // Check if axis and position are in same side, if so, change it to common 'center'

        const oppositeAxis: Record<
            "top" | "bottom" | "left" | "right" | "center",
            string[]
        > = {
            top: ["top", "bottom"],
            bottom: ["top", "bottom"],
            left: ["left", "right"],
            right: ["left", "right"],
            center: ["center"],
        };

        const isSameAxis =
            oppositeAxis[axis as keyof typeof oppositeAxis].includes(position);

        const axisToUse =
            axis === "center" ? "center" : isSameAxis ? "center" : axis;

        if (axisToUse !== "center") {
            popoverContentStyles[axisToUse] = "0px";
            popoverIndicatorStyles[axisToUse] = `${indicatorGap}px`;
        } else {
            if (position === "top" || position === "bottom") {
                // Algo: center = (content.width / 2) - (trigger.width / 2)
                const offsetLeft = contentWidth / 2 - triggerWidth / 2;

                popoverContentStyles["left"] = `${offsetLeft * -1}px`;
                popoverIndicatorStyles["left"] = `${contentWidth / 2 - 8}px`;
            } else {
                // Algo: center = (content.height / 2) - (trigger.height / 2)
                const offsetTop = contentHeight / 2 - triggerHeight / 2;

                popoverContentStyles["top"] = `${offsetTop * -1}px`;
                popoverIndicatorStyles["top"] = `${contentHeight / 2 - 8}px`;
            }
        }

        console.log({
            content: popoverContentStyles,
            indicator: popoverIndicatorStyles,
        });
        setPopoverStyle((prev) => ({
            content: popoverContentStyles,
            indicator: popoverIndicatorStyles,
        }));
    }, [position, axis]);

    return (
        <div
            data-name="popover-container"
            className="w-fit relative group"
            tabIndex={-1}
        >
            {clonedTrigger}

            {/* Content */}
            <div
                data-name="popover-content"
                className={`w-max absolute invisible peer-focus:visible group-focus-within:visible shadow-[0_0_10px_rgba(0,0,0,0.1)] bg-white z-[999] ${className}`}
                style={popoverStyle.content}
                ref={contentRef}
                tabIndex={0}
            >
                {content ?? ""}

                {/* Indicator */}
                {indicator && (
                    <div
                        data-name="popover-indicator"
                        className="w-3 h-3 bg-white rotate-45 absolute z-[-10]"
                        style={popoverStyle.indicator}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default Popover;
