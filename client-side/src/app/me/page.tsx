import PreviewPost from "@/components/PreviewPost";
import React from "react";

const User = () => {
    return (
        <div>
            {[...Array(6)].map((i, idx) => (
                <React.Fragment key={idx}>
                    <div className="pb-1 mb-1 border-b border-neutral-300"></div>
                    {/* <PreviewPost /> */}
                </React.Fragment>
            ))}
        </div>
    );
};

export default User;
