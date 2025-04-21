import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <PageLayout>
            <MainDiv>{children}</MainDiv>
            <Sidebar>Sidebar</Sidebar>
        </PageLayout>
    );
};

export default Layout;
