"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Drawer from "@/components/Drawer";
import DrawerContent from "@/components/DrawerContent";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

    return (
        <html lang="en">
            <body className="h-screen flex flex-col overflow-hidden">
                {/* Navbar */}
                <Navbar setDrawerOpened={setDrawerOpened} />

                {/* Main Section */}
                <div className="flex-1 grow overflow-x-hidden">
                    <Drawer
                        drawerContent={<DrawerContent />}
                        drawerOpened={drawerOpened}
                        setDrawerOpened={setDrawerOpened}
                    >
                        {children}
                    </Drawer>
                </div>
            </body>
        </html>
    );
}
