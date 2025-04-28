import React from "react";

const EmptyDataLabel = ({
    children,
    label,
}: {
    children?: React.ReactNode;
    label?: string;
}) => {
    return (
        <p className="text-center text-slate-500 py-8 px-4 mt-4 border border-dashed border-slate-400 rounded-lg w-full">
            {children ?? label}
        </p>
    );
};

export default EmptyDataLabel;
