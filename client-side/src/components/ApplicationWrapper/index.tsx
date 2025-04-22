"use client";

import React, { useState } from "react";
import Navbar from "../Navbar";
import Drawer from "../Drawer";
import DrawerContent from "../DrawerContent";
import { Provider } from "react-redux";
import store from "@/store/app/store";

const ApplicationWrapper = ({ children }: { children: React.ReactNode }) => {
    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
    return (
        <Provider store={store}>
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
        </Provider>
    );
};

export default ApplicationWrapper;
