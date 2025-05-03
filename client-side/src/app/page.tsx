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
    const [params, setParams] = useState<{
        page: number;
        limit: number;
        sortBy: string;
    }>({
        page: 1,
        limit: 8,
        sortBy: "new",
    });
    const {
        data: postsData,
        refetch,
        isFetching,
        isSuccess,
    } = useFetchPostsQuery({ params: params });

    return (
        <PageLayout>
            <MainDiv className="">
                {/* Header */}
                <div className="mb-2 px-4 flex items-center gap-3">
                    <select
                        value={params.sortBy}
                        onChange={(e) =>
                            setParams((prev) => ({
                                ...prev,
                                sortBy: e.target.value,
                                page: 1,
                            }))
                        }
                        className="bg-neutral-100 rounded-full text-sm px-2.5 py-1.5 outline-none text-neutral-600 font-semibold"
                    >
                        <option value="" disabled>
                            Sort By
                        </option>
                        <option value="new">New</option>
                        <option value="old">Old</option>
                    </select>

                    <select
                        defaultValue={"list"}
                        className="bg-neutral-100 rounded-full text-sm px-2.5 py-1.5 outline-none text-neutral-600 font-semibold"
                    >
                        <option value="" disabled>
                            Layout
                        </option>
                        <option value="list">List</option>
                        <option value="grid" disabled>
                            Grid
                        </option>
                    </select>
                </div>

                {/* Posts */}
                {isSuccess && (
                    <InfiniteScroll
                        className="!overflow-visible"
                        dataLength={postsData.data?.length}
                        next={() =>
                            setParams((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            }))
                        }
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
                            .map((post: PostInterface, idx: number) => (
                                <React.Fragment key={idx}>
                                    <SidebarPost postData={post} />
                                    <div className="pb-0.5 mb-0.5 border-b border-neutral-300"></div>
                                </React.Fragment>
                            ))}
                </div>

                <Footer></Footer>
            </Sidebar>
        </PageLayout>
    );
}
