"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const Popover = ({
    children,
    content,
    parentStyles = {},
    className = "",
    position = "bottom",
    axis = "center",
    triggerType = "auto",
    contentVisible = false,
    onWrapperBlur = () => {},
    viewOnHover = false,
    indicator = true,
    closeOnClick = true,
}: {
    children: React.ReactElement<any, any>;
    content?: string | React.ReactNode;
    parentStyles?: React.CSSProperties;
    className?: string;
    position?: "top" | "bottom" | "left" | "right";
    axis?: "top" | "bottom" | "left" | "right" | "center";
    triggerType?: "auto" | "manual";
    contentVisible?: boolean;
    onWrapperBlur?: () => void;
    viewOnHover?: boolean;
    indicator?: boolean;
    closeOnClick?: boolean;
}) => {
    const [popoverOpened, setPopoverOpened] = useState<boolean>(false);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const pathname = usePathname();

    const [popoverStyle, setPopoverStyle] = useState<{
        content: {};
        indicator: {};
    }>({ content: {}, indicator: {} });

    const clonedTrigger = React.cloneElement(children, {
        ref: triggerRef,
        className: `${children.props.className || ""} peer`,
        "data-name": "popover-trigger",
        tabIndex: 0,
        onClick: () =>
            triggerType === "auto"
                ? setPopoverOpened((prev) => (closeOnClick ? !prev : prev))
                : null,
    });

    // Calculate the Direction of Popover
    const calculatePosition = (
        position: "top" | "bottom" | "left" | "right",
        gap: number,
        triggerRect: DOMRect,
        contentRect: DOMRect
    ) => {
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;

        const oppositePosition: any = {
            top: "bottom",
            bottom: "top",
            left: "right",
            right: "left",
        };

        const possiblePositions: Array<"top" | "bottom" | "left" | "right"> =
            [];

        // Check if Top is Possible Direction
        if (triggerRect.top - gap - contentRect.height > 0) {
            possiblePositions.push("top");
        }

        // Check if Bottom is Possible Direction
        if (triggerRect.bottom + gap + contentRect.height < innerHeight) {
            possiblePositions.push("bottom");
        }

        // Check if Left is Possible Direction
        if (triggerRect.left - gap - contentRect.width > 0) {
            possiblePositions.push("left");
        }

        // Check if Right is Possible Direction
        if (triggerRect.right + gap + contentRect.width < innerWidth) {
            possiblePositions.push("right");
        }

        // If Calculated and User given Directions are same
        if (possiblePositions.includes(position)) return position;

        // If Calculated and User given Directions are opposite
        if (possiblePositions.includes(oppositePosition[position]))
            return oppositePosition[position];

        // If There is any Calculated position as User given or Opposite of User given is not possible
        if (possiblePositions.length > 0) return possiblePositions[0];

        // The direction with most space
        if (position === "top" || position === "bottom") {
            const topSpace = triggerRect.top - gap - contentRect.height;
            const bottomSpace =
                innerHeight - triggerRect.bottom + gap + contentRect.height;

            return topSpace < bottomSpace ? "top" : "bottom";
        }

        if (position === "left" || position === "right") {
            const leftSpace = triggerRect.left - gap - contentRect.width;
            const rightSpace =
                innerWidth - triggerRect.right + gap + contentRect.width;

            return leftSpace < rightSpace ? "left" : "right";
        }

        // Fallback if Non matches
        return position;
    };

    // This func will calculate the positions of the content
    const updatePositions: () => void = () => {
        const gap = 10;
        const indicatorGap = 6;
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        const contentRect = contentRef.current?.getBoundingClientRect();

        if (!triggerRect || !contentRect) return;

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

        // Check if the Content goes outside the screen based on position
        const finalPosition = calculatePosition(
            position,
            gap,
            triggerRect,
            contentRect
        );

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

        const sameAxis = oppositeAxis[axis]?.includes(position);
        const axisToUse = axis === "center" || sameAxis ? "center" : axis;

        if (axisToUse === "center") {
            const isVertical = position === "top" || position === "bottom";
            const offset = isVertical
                ? contentWidth / 2 - triggerWidth / 2
                : contentHeight / 2 - triggerHeight / 2;

            const key = isVertical ? "left" : "top";
            const centerIndicatorOffset = isVertical
                ? contentWidth / 2 - 8
                : contentHeight / 2 - 8;

            popoverContentStyles[key] = `${-offset}px`;
            popoverIndicatorStyles[key] = `${centerIndicatorOffset}px`;
        } else {
            popoverContentStyles[axisToUse] = "0px";
            popoverIndicatorStyles[axisToUse] = `${indicatorGap}px`;
        }

        setPopoverStyle((prev) => ({
            content: popoverContentStyles,
            indicator: popoverIndicatorStyles,
        }));
    };

    // Observe any Changes in the doc
    useLayoutEffect(() => {
        const resizeObserver = new ResizeObserver(updatePositions);
        triggerRef.current && resizeObserver.observe(triggerRef.current);
        contentRef.current && resizeObserver.observe(contentRef.current);

        window.addEventListener("resize", updatePositions);
        window.addEventListener("scroll", updatePositions, true); // true = capture phase

        updatePositions(); // initial call

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updatePositions);
            window.removeEventListener("scroll", updatePositions, true);
        };
    }, []);

    // Check if container blurred
    useEffect(() => {
        const handleWindowClick = (e: MouseEvent) => {
            if (!popoverOpened && !contentVisible) return;

            const target = e.target as HTMLElement;

            if (
                wrapperRef.current &&
                contentRef.current &&
                !wrapperRef.current.contains(target) &&
                !contentRef.current.contains(target)
            ) {
                if (triggerType === "auto") {
                    setPopoverOpened(false);
                }
                onWrapperBlur();
            }

            // else if (
            //     contentRef.current &&
            //     contentRef.current.contains(target) &&
            //     (target.closest("a") || target.closest("button"))
            // ) {
            //     if (triggerType === "auto") {
            //         setPopoverOpened(false);
            //     }
            // }
        };

        document.addEventListener("click", handleWindowClick);

        return () => {
            document.removeEventListener("click", handleWindowClick);
        };
    }, [popoverOpened, contentVisible, triggerType]);

    // Close Popover if path changes
    useEffect(() => {
        setPopoverOpened(false);
    }, [pathname]);

    return (
        <div
            data-name="popover-container"
            className="w-fit relative group"
            tabIndex={-1}
            style={parentStyles}
            ref={wrapperRef}
        >
            {clonedTrigger}

            {/* Content */}
            <div
                data-name="popover-content"
                className={`w-max absolute invisible bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] z-[45]
                    ${
                        triggerType === "auto"
                            ? viewOnHover
                                ? "transition-[visibility] delay-200 peer-hover:visible group-hover:visible hover:visible peer-focus:visible group-focus-within:visible focus:visible"
                                : popoverOpened
                                ? "!visible"
                                : ""
                            : contentVisible
                            ? "!visible"
                            : ""
                    }
                    ${className || ""}
                  `}
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
