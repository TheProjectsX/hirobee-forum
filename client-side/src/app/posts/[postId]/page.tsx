import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import PreviewPost from "@/components/PreviewPost";
import React from "react";

const Post = () => {
    return (
        <PageLayout>
            <MainDiv className="py-2">
                {/* Post Preview */}
                <PreviewPost />
            </MainDiv>

            <Sidebar>Where am I?</Sidebar>
        </PageLayout>
    );
};

export default Post;
