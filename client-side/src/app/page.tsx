"use client";

import React from "react";

import Footer from "@/components/Footer";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost, { PostInterface } from "@/components/PreviewPost";
import SidebarPost from "@/components/PreviewPost/SidebarPost";
import { useFetchPostsQuery } from "@/store/features/posts/postsApiSlice";

export default function Home() {
    const { data: postsData, isLoading, isSuccess } = useFetchPostsQuery({});

    return (
        <PageLayout>
            <MainDiv className="">
                {/* Posts */}
                {isLoading && (
                    <p className="text-center text-lg py-10 font-semibold italic">
                        Fetching Posts...
                    </p>
                )}

                {isSuccess && (
                    <div>
                        {postsData.data?.map((post: {}, idx: number) => (
                            <React.Fragment key={idx}>
                                <div className="pb-1 mb-1 border-b border-neutral-300"></div>
                                <PreviewPost postData={post as PostInterface} />
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </MainDiv>
            <Sidebar className="h-fit">
                {/* Sidebar Content */}
                <div className="p-5 bg-slate-100/80 rounded-2xl">
                    <div className="flex justify-between items-center">
                        <h3 className="uppercase text-neutral-500 font-medium text-xs">
                            Recent Posts
                        </h3>
                        <button className="outline-none text-blue-700 cursor-pointer text-sm">
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
