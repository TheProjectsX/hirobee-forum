"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Drawer from "@/components/Drawer";

export default function RootLayout({ children }) {
    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

    return (
        <html lang="en">
            <body className="font-ubuntu h-screen flex flex-col">
                {/* Navbar */}
                <Navbar setDrawerOpened={setDrawerOpened} />

                {/* Main Section */}
                <main className="flex-1 grow overflow-x-hidden">
                    <Drawer
                        drawerOpened={drawerOpened}
                        setDrawerOpened={setDrawerOpened}
                    >
                        {children}
                    </Drawer>
                </main>
            </body>
        </html>
    );
}
