import React from "react";

const Popover = ({
    content,
    children,
    position,
}: {
    content: React.ReactNode;
    children: React.ReactNode;
    position: "top" | "bottom" | "left" | "right";
}) => {
    return (
        <div data-name="popover-container">
            <div data-name="popover-trigger">{children}</div>
            <div data-name="popover-content" className="w-fit">
                {content}
            </div>
        </div>
    );
};

export default Popover;
