"use client";

// import useDynamicInput from "@/components/DynamicInput/index2";
import DynamicInput from "@/components/DynamicInput";
import React, { useEffect, useMemo, useState } from "react";

const TempRoute = () => {
    // const { DynamicInput, handleAddItem, values } = useDynamicInput({
    //     defaultCount: 2,
    // });

    // useEffect(() => console.log(values), [values]);

    const [values, setValues] = useState<string[]>([]);

    return (
        <div className="p-10">
            {/* {useMemo(
                () => (
                    <DynamicInput />
                ),
                []
            )} */}
            <DynamicInput onChange={(values) => setValues(values)}>
                {(inputProps, removeButtonProps) => (
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            className="min-w-80 rounded-lg focus:outline-[dodgerBlue]  bg-slate-100 hover:bg-slate-200 px-4 py-3 text-sm"
                            placeholder="Enter Rule Here..."
                            minLength={10}
                            required
                            {...inputProps}
                        />
                        <button
                            className="rounded-full p-1 bg-slate-200 hover:text-red-600 disabled:pointer-events-none"
                            {...removeButtonProps}
                        >
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 512 512"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
                            </svg>
                        </button>
                    </div>
                )}
            </DynamicInput>

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
