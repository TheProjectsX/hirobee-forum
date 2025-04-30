"use client";

import React, { use, useState } from "react";
import { useFetchSpecificUserCommentsQuery } from "@/store/features/users/usersApiSlice";
import PreviewComment, { CommentInterface } from "@/components/PreviewComment";
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import EmptyDataLabel from "@/components/EmptyDataLabel";
import InfiniteScroll from "react-infinite-scroll-component";

const Comments = ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = use(params);
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: commentsData,
        isFetching,
        isSuccess,
    } = useFetchSpecificUserCommentsQuery({
        username,
        params: { page: currentPage, limit: 8 },
    });

    return (
        <div>
            {isSuccess && commentsData.data.length === 0 && (
                <EmptyDataLabel>
                    This user haven't Commented in any Post Yet!
                </EmptyDataLabel>
            )}

            {isSuccess && commentsData.data.length > 0 && (
                <InfiniteScroll
                    className="!overflow-hidden"
                    dataLength={commentsData.data?.length}
                    next={() => setCurrentPage((prev) => prev + 1)}
                    hasMore={commentsData.pagination?.has_next_page}
                    loader=""
                >
                    {commentsData.data.map(
                        (commentData: CommentInterface, idx: number) => (
                            <React.Fragment key={idx}>
                                <PreviewComment
                                    className=""
                                    key={idx}
                                    commentData={commentData}
                                />
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

export default Comments;
