import React from "react";
import "./globals.css";
import ApplicationWrapper from "@/components/ApplicationWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hirobee – Explore. Share. Connect.",
    description:
        "Join communities, ask questions, and talk about anything that matters.",
    openGraph: {
        title: "Hirobee – Explore. Share. Connect.",
        description: "A place for discussions on anime, games, life, and more.",
        url: "https://hirobee.vercel.com",
        siteName: "Hirobee",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="shortcut icon"
                    href="/icons/logo.png"
                    type="image/x-icon"
                />
            </head>

            <body className="flex flex-col light min-h-screen">
                <ApplicationWrapper>{children}</ApplicationWrapper>
            </body>
        </html>
    );
}
