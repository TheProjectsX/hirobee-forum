"use client";

import React, { use } from "react";
import Comment, { CommentInterface } from "@/app/posts/[postId]/comment";
import { useFetchSpecificUserCommentsQuery } from "@/store/features/users/usersApiSlice";

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
                        <Comment key={idx} commentData={commentData} />
                    )
                )}
        </div>
    );
};

export default Comments;
