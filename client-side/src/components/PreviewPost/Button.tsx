import React from "react";
import { IconType } from "react-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    Icon?: IconType;
}

const Button = ({
    children,
    className,
    label,
    Icon,
    ...options
}: ButtonProps) => {
    return (
        <button
            className={`rounded-full px-3.5 py-1.5 text-neutral-700 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 flex items-center gap-1.5 cursor-pointer relative ${
                className ?? ""
            }`}
            {...options}
        >
            {Icon && <Icon className="text-lg" />}
            {(children || label) && (
                <span className="text-xs font-semibold">
                    {children ?? label}
                </span>
            )}
        </button>
    );
};

export default Button;
