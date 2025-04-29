"use client";

import React, { useState } from "react";

import Footer from "@/components/Footer";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost, { PostInterface } from "@/components/PreviewPost";
import SidebarPost from "@/components/PreviewPost/SidebarPost";
import { useFetchPostsQuery } from "@/store/features/posts/postsApiSlice";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: postsData,
        refetch,
        isFetching,
        isSuccess,
    } = useFetchPostsQuery({ params: { page: currentPage, limit: 8 } });

    return (
        <PageLayout>
            <MainDiv className="">
                {/* Posts */}
                {isSuccess && (
                    <InfiniteScroll
                        className="!overflow-hidden"
                        dataLength={postsData.data?.length}
                        next={() => setCurrentPage((prev) => prev + 1)}
                        hasMore={postsData.pagination.has_next_page}
                        loader=""
                    >
                        {postsData.data?.map((postData: {}, idx: number) => (
                            <React.Fragment key={idx}>
                                <div className="pb-1.5 mb-1.5 border-b border-neutral-300"></div>
                                <PreviewPost
                                    postData={postData as PostInterface}
                                    onDelete={refetch}
                                />
                            </React.Fragment>
                        ))}
                    </InfiniteScroll>
                )}

                {isFetching && <LoadingPlaceholder />}
            </MainDiv>
            <Sidebar className="h-fit">
                {/* Sidebar Content */}
                <div
                    className="p-5 bg-slate-100/80 rounded-2xl"
                    data-name="sidebar-posts"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="uppercase text-neutral-500 font-medium text-xs">
                            Recent Posts
                        </h3>
                        <button
                            onClick={(e) => {
                                const target = e.target as HTMLElement;
                                (
                                    target.closest(
                                        "[data-name='sidebar-posts']"
                                    ) as HTMLElement
                                ).style.display = "none";
                            }}
                            className="outline-none text-blue-700 cursor-pointer text-sm"
                        >
                            Clear
                        </button>
                    </div>

                    {isSuccess &&
                        postsData.data
                            ?.slice(0, 5)
                            .map((post: {}, idx: number) => (
                                <React.Fragment key={idx}>
                                    <SidebarPost
                                        postData={post as PostInterface}
                                    />
                                    <div className="pb-0.5 mb-0.5 border-b border-neutral-300"></div>
                                </React.Fragment>
                            ))}
                </div>

                <Footer></Footer>
            </Sidebar>
        </PageLayout>
    );
}
