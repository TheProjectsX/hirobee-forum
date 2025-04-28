import React from "react";
import "./globals.css";
import ApplicationWrapper from "@/components/ApplicationWrapper";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="flex flex-col light">
                <ApplicationWrapper>{children}</ApplicationWrapper>
            </body>
        </html>
    );
}
