import React, { ButtonHTMLAttributes } from "react";

const Button = ({ children, className, ...options }: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            className={`p-2 rounded-full hover:bg-slate-200 cursor-pointer flex items-center ${className}`}
            {...options}
        >
            {children}
        </button>
    );
};

export default Button;
