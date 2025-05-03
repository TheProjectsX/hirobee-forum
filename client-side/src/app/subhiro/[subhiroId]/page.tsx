"use client";

import React, { use, useState } from "react";
import EmptyDataLabel from "@/components/EmptyDataLabel";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import PreviewPost, { PostInterface } from "@/components/PreviewPost";
import { useFetchSubhiroPostsQuery } from "@/store/features/subhiro/subhiroApiSlice";
import InfiniteScroll from "react-infinite-scroll-component";

const Posts = ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = use(params);
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: postsData,
        isFetching,
        isSuccess,
    } = useFetchSubhiroPostsQuery({
        username,
        params: { page: currentPage, limit: 8 },
    });

    return (
        <div>
            {isSuccess && postsData.data.length === 0 && (
                <EmptyDataLabel>
                    This SubHiro Doesn't have any Post Yet!
                </EmptyDataLabel>
            )}

            {isSuccess && postsData.data.length > 0 && (
                <InfiniteScroll
                    className="!overflow-visible"
                    dataLength={postsData.data?.length}
                    next={() => setCurrentPage((prev) => prev + 1)}
                    hasMore={postsData.pagination.has_next_page}
                    loader=""
                >
                    {postsData.data.map(
                        (postData: PostInterface, idx: number) => (
                            <React.Fragment key={idx}>
                                <PreviewPost postData={postData} />
                                <div className="pb-1.5 mb-1.5 border-b border-neutral-300"></div>
                            </React.Fragment>
                        )
                    )}
                </InfiniteScroll>
            )}
            {isFetching && <LoadingPlaceholder />}
        </div>
    );
};

export default Posts;
