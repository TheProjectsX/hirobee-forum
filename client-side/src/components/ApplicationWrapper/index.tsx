"use client";

import React, { useState } from "react";
import Navbar from "../Navbar";
import Drawer from "../Drawer";
import DrawerContent from "../DrawerContent";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/store/app/store";
import { Bounce, ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import Auth from "../Auth";
import {
    setDrawerOpened,
    SiteConfigState,
} from "@/store/features/config/configSlice";

const ProviderWrapped = ({ children }: { children: React.ReactNode }) => {
    const siteConfig: SiteConfigState = useSelector(
        (state: any) => state.site_config
    );
    const dispatch = useDispatch();

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
            <Auth />
            {/* Navbar */}
            <Navbar />

            {/* Main Section */}
            <div className="flex-1 grow overflow-x-hidden">
                <Drawer
                    drawerContent={<DrawerContent />}
                    drawerOpened={siteConfig.drawerOpened}
                    onDrawerOpened={() => {
                        console.log("CLICKED");
                        console.log(dispatch(setDrawerOpened(true)));
                        console.log("AFTER CLICK");
                    }}
                    onDrawerClosed={() => dispatch(setDrawerOpened(false))}
                >
                    {children}
                </Drawer>
            </div>
        </>
    );
};

const ApplicationWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Provider store={store}>
                <ProviderWrapped>{children}</ProviderWrapped>
            </Provider>
        </>
    );
};

export default ApplicationWrapper;
