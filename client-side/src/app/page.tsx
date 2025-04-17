import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PreviewPost";

import React from "react";

export default function Home() {
    return (
        <PageLayout>
            <MainDiv className="">
                {/* Contents */}
                <div>
                    {[...Array(6)].map((i, idx) => (
                        <React.Fragment key={idx}>
                            <div className="pb-1 mb-1 border-b border-neutral-300"></div>
                            <PreviewPost></PreviewPost>
                        </React.Fragment>
                    ))}
                </div>
            </MainDiv>
            <Sidebar className="">I am where?</Sidebar>
        </PageLayout>
    );
}
