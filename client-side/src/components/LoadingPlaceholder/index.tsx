import React from "react";

const LoadingPlaceholder = () => {
    return (
        <div className="flex items-center justify-center w-full h-56">
            <img
                src="/icons/logo.png"
                alt="Hirobee Logo"
                className="rounded-full w-16 h-16 animate-bounce shadow-[0_0_40px_8px_dodgerblue]"
            />
        </div>
    );
};

export default LoadingPlaceholder;
