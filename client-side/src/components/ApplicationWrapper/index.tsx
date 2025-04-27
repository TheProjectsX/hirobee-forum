"use client";

import React, { useState } from "react";
import Navbar from "../Navbar";
import Drawer from "../Drawer";
import DrawerContent from "../DrawerContent";
import { Provider } from "react-redux";
import store from "@/store/app/store";
import { Bounce, ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";

const ApplicationWrapper = ({ children }: { children: React.ReactNode }) => {
    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

    return (
        <>
            <NextTopLoader />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
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
        </>
    );
};

export default ApplicationWrapper;
