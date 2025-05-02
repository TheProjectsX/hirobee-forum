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
            <head>
                <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
            </head>
            <body className="flex flex-col light min-h-screen">
                <ApplicationWrapper>{children}</ApplicationWrapper>
            </body>
        </html>
    );
}
