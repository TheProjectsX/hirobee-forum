"use client";

import EmptyDataLabel from "@/components/EmptyDataLabel";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import PreviewPost, { PostInterface } from "@/components/PreviewPost";
import { useFetchSpecificUserPostsQuery } from "@/store/features/users/usersApiSlice";
import React, { use, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const Posts = ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = use(params);
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: postsData,
        isLoading,
        isFetching,
        isSuccess,
    } = useFetchSpecificUserPostsQuery({
        username,
        params: { page: currentPage, limit: 4 },
    });

    return (
        <div>
            {isSuccess && postsData.data.length === 0 && (
                <EmptyDataLabel>
                    This user haven't Posted anything Yet!
                </EmptyDataLabel>
            )}

            {isSuccess && postsData.data.length > 0 && (
                <InfiniteScroll
                    className="!overflow-hidden"
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
