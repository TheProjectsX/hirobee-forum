"use client";

import PreviewPost, { PostInterface } from "@/components/PreviewPost";
import { useFetchSpecificUserPostsQuery } from "@/store/features/users/usersApiSlice";
import React, { use } from "react";

const Posts = ({ params }: { params: Promise<{ username: string }> }) => {
    const { username } = use(params);
    const {
        data: userPosts,
        isLoading,
        isSuccess,
    } = useFetchSpecificUserPostsQuery({ username });

    return (
        <div>
            {isLoading && <p>Loading</p>}
            {isSuccess &&
                userPosts.data.length > 0 &&
                userPosts.data.map((postData: PostInterface, idx: number) => (
                    <React.Fragment key={idx}>
                        <PreviewPost postData={postData} />
                        <div className="pb-1.5 mb-1.5 border-b border-neutral-300"></div>
                    </React.Fragment>
                ))}
        </div>
    );
};

export default Posts;
