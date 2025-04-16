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

                <div className="p-20">
                    <p className="mb-10">Just a Test for the Hover Popover</p>
                    <button className="px-5 py-2 rounded-2xl bg-neutral-200 cursor-pointer">
                        Click ME!
                    </button>
                </div>
            </MainDiv>
            <Sidebar className="">I am where?</Sidebar>
        </PageLayout>
    );
}
