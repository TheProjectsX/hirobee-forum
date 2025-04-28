"use client";

import React, { use } from "react";
import { useFetchSpecificUserCommentsQuery } from "@/store/features/users/usersApiSlice";
import PreviewComment, { CommentInterface } from "@/components/PreviewComment";

const Comments = ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = use(params);
    const {
        data: commentsData,
        isLoading,
        isSuccess,
    } = useFetchSpecificUserCommentsQuery({ username });

    return (
        <div>
            {isLoading && <p>Loading</p>}

            {isSuccess &&
                commentsData.data.length > 0 &&
                commentsData.data.map(
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
        </div>
    );
};

export default Comments;
