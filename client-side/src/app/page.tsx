import Footer from "@/components/Footer";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PostPreview";
import SidebarPost from "@/components/PostPreview/SidebarPost";

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
            <Sidebar className=" h-fit">
                {/* Sidebar Content */}
                <div className="p-5 bg-slate-100/80 rounded-2xl">
                    <div className="flex justify-between items-center text-sm">
                        <h3 className="uppercase text-neutral-500">
                            Recent Posts
                        </h3>
                        <button className="outline-none text-blue-700 cursor-pointer">
                            Clear
                        </button>
                    </div>

                    {[...Array(6)].map((i, idx) => (
                        <React.Fragment key={idx}>
                            <SidebarPost></SidebarPost>
                            <div className="pb-0.5 mb-0.5 border-b border-neutral-300"></div>
                        </React.Fragment>
                    ))}
                </div>

                <Footer></Footer>
            </Sidebar>
        </PageLayout>
    );
}
