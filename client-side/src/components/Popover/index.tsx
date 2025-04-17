"use client";

import React, { useEffect, useRef, useState } from "react";

const Popover = ({
    children,
    content = "",
    className = "",
    position = "bottom",
    axis = "center",
}: {
    children: React.ReactElement<any, any>;
    content?: string | React.ReactNode;
    className?: string;
    position?: "top" | "bottom" | "left" | "right";
    axis?: "top" | "bottom" | "left" | "right" | "center";
}) => {
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [popoverStyle, setPopoverStyle] = useState<{}>({});

    const clonedTrigger = React.cloneElement(children, {
        ref: triggerRef,
        className: `${children.props.className || ""} peer`,
        "data-name": "popover-trigger",
    });

    useEffect(() => {
        const gap = 6;
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        const contentRect = contentRef.current?.getBoundingClientRect();

        const popoverActionStyles: {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
        } = {};

        // Give Position
        const size =
            position === "top" || position === "bottom"
                ? triggerRect?.height ?? 0
                : triggerRect?.width ?? 0;

        const offset = `${size + gap}px`;

        const oppositeSide: Record<string, keyof typeof popoverActionStyles> = {
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
                (triggerRect?.top ?? 0) - gap - (contentRect?.height ?? 0) <
                    0) ||
            (position === "bottom" &&
                (triggerRect?.bottom ?? 0) + gap + (contentRect?.height ?? 0) >
                    windowSize.height) ||
            (position === "left" &&
                (triggerRect?.left ?? 0) - gap - (contentRect?.width ?? 0) <
                    0) ||
            (position === "right" &&
                (triggerRect?.right ?? 0) + gap + (contentRect?.width ?? 0) < 0)
        ) {
            finalPosition = oppositeSide[position];
        }

        popoverActionStyles[oppositeSide[finalPosition]] = offset;

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

        if (axisToUse !== "center") popoverActionStyles[axisToUse] = "0px";
        else {
            if (position === "top" || position === "bottom") {
                // Algo: center = (content.width / 2) - (trigger.width / 2)
                const offsetLeft =
                    (contentRect?.width ?? 0) / 2 -
                    (triggerRect?.width ?? 0) / 2;
                popoverActionStyles["left"] = `-${offsetLeft}px`;
            } else {
                // Algo: center = (content.height / 2) - (trigger.height / 2)
                const offsetTop =
                    (contentRect?.height ?? 0) / 2 -
                    (triggerRect?.height ?? 0) / 2;

                popoverActionStyles["top"] = `-${offsetTop}px`;
            }
        }

        setPopoverStyle((prev) => popoverActionStyles);
    }, [position, axis]);

    return (
        <div data-name="popover-container" className="w-fit relative">
            {clonedTrigger}

            <div
                data-name="popover-content"
                className={`w-max absolute hidden peer-focus:block shadow-[0_0_10px_rgba(0,0,0,0.1)] bg-white ${className}`}
                style={popoverStyle}
                ref={contentRef}
            >
                {content}
            </div>
        </div>
    );
};

export default Popover;
