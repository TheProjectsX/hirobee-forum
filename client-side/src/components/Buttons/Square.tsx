import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";

interface SquareButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    Icon?: IconType;
}

const SquareButton = ({
    children,
    className,
    label,
    Icon,
    ...options
}: SquareButtonProps) => {
    return (
        <button
            className={`py-3 px-6 hover:bg-slate-50 active:bg-slate-100 cursor-pointer flex items-center gap-1.5 ${className}`}
            {...options}
        >
            <span className="w-6">{Icon && <Icon className="text-xl" />}</span>
            <span className="text-sm">{children ?? label}</span>
        </button>
    );
};

export default SquareButton;
