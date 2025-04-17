import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PreviewPost";

import React from "react";

export default function Home() {
    return (
        <PageLayout>
            <MainDiv className="">
                {/* Contents */}
                <div>
                    <PreviewPost></PreviewPost>
                </div>
            </MainDiv>
            <Sidebar className="">I am where?</Sidebar>
        </PageLayout>
    );
}
