import React from "react";

const Title = ({
    label,
    children,
    className,
}: {
    label?: string;
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`mb-6 pt-4 w-fit ${className ?? ""}`}>
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-1">
                {label ?? children ?? ""}
            </h1>
            <div className="h-1 w-full bg-blue-600 rounded"></div>
        </div>
    );
};

export default Title;
