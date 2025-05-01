"use client";

import useDynamicInput from "@/components/DynamicInput";
import React, { useEffect } from "react";

const TempRoute = () => {
    const { DynamicInput, handleAddItem, values } = useDynamicInput({
        defaultCount: 2,
    });

    useEffect(() => console.log(values), [values]);

    return (
        <div className="p-10">
            <DynamicInput />

            <div className="mb-3 pb-3 border-b"></div>

            <ul className="list-disc">
                {values.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default TempRoute;
