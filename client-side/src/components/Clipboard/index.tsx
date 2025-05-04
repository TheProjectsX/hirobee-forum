"use client";

import React, { useEffect, useState } from "react";

const Clipboard = ({
    children,
    value,
    onCopied = () => {},
}: {
    children: React.ReactElement<any, any>;
    value: string;
    onCopied?: () => void;
}) => {
    const [hostname, setHostname] = useState<string>();

    useEffect(() => {
        setHostname(window.location.origin);
    }, []);

    const copyToClipboard = (valueToCopy: string) => {
        navigator?.clipboard
            ?.writeText(valueToCopy.replaceAll("#baseUrl", hostname ?? ""))
            .then(() => {
                console.log("Copy Successfull");
                onCopied();
            })
            .catch((error) => {
                console.error("Failed to Copy text: ", error);
            });
    };

    const clonedTrigger = React.cloneElement(children, {
        onClick: () => copyToClipboard(value),
    });

    return clonedTrigger;
};

export default Clipboard;
