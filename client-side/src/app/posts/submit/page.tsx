"use client";

import RoundedButton from "@/components/Buttons/Rounded";
import Footer from "@/components/Footer";
import PageLayout, { MainDiv, Sidebar } from "@/components/PageLayout";
import Popover from "@/components/Popover";
import { PostInterface } from "@/components/PreviewPost";
import SidebarPost from "@/components/PreviewPost/SidebarPost";
import {
    useFetchSinglePostQuery,
    useFetchUserPostsQuery,
    useInsertPostMutation,
    useUpdatePostMutation,
} from "@/store/features/user/userApiSlice";
import { Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const SubmitPost = ({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const targetPostId = use(searchParams).postId;

    const {
        data: userPosts,
        isLoading: isUserPostsLoading,
        isSuccess: isUserPostsSuccess,
    } = useFetchUserPostsQuery({ limit: 8 });

    const {
        data: targetPost,
        isLoading: isTargetPostLoading,
        isSuccess: isTargetPostSuccess,
    } = useFetchSinglePostQuery(
        { postId: targetPostId },
        { skip: targetPostId === undefined }
    );

    const [
        insertPost,
        { isLoading: isInsertPostLoading, isSuccess: isInsertPostSuccess },
    ] = useInsertPostMutation();

    const [
        updatePost,
        { isLoading: isUpdatePostLoading, isSuccess: isUpdatePostSuccess },
    ] = useUpdatePostMutation();

    const router = useRouter();

    const [communitySearch, setCommunitySearch] = useState<{
        visible: boolean;
        data: Array<{
            profile_picture: string;
            hironame: string;
            members: string;
        }>;
    }>({
        visible: false,
        data: [],
    });
    const [postValues, setPostValues] = useState<{
        community: null | {
            profile_picture: string;
            hironame: string;
            members: string;
        };
        title: string;
        content: string;
        images: Array<string>;
    }>({
        community: null,
        title: "",
        content: "",
        images: [],
    });

    // Handle Community Search
    const handleCommunitySearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setCommunitySearch((prev) => ({ ...prev, visible: true }));

        setTimeout(() => {
            setCommunitySearch((prev) => ({
                ...prev,
                data: [
                    {
                        profile_picture: "https://placehold.co/300",
                        hironame: "AskHiro",
                        members: "554K",
                    },
                    {
                        profile_picture: "https://placehold.co/300",
                        hironame: "AskHiro",
                        members: "900K",
                    },
                    {
                        profile_picture: "https://placehold.co/300",
                        hironame: "AskHiro",
                        members: "699K",
                    },
                ],
            }));
        }, 300);
    };

    // Check if is in Post Edit Mode! and update data
    useEffect(() => {
        if (!isTargetPostSuccess) return;

        setPostValues({
            title: targetPost.title,
            content: targetPost.content ?? "",
            community: targetPost.subhiro?.hironame ? targetPost.subhiro : null,
            images: targetPost.images ?? [],
        });
    }, [isTargetPostSuccess]);

    // Handle Submit Post
    const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body = { ...postValues };

        try {
            if (targetPostId === undefined) {
                const response = await insertPost({ body }).unwrap();
                router.push(`/posts/${response.id}`);
                toast.success("Post Successful!");
            } else {
                const response = await updatePost({
                    postId: targetPostId,
                    body,
                }).unwrap();
                router.push(`/posts/${response.id}`);
                toast.success("Post Updated!");
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message ?? "Failed to Submit Post");
        }
    };

    return (
        <PageLayout breakpoint="770px" wrap>
            <MainDiv className="p-2">
                <div className="mb-4 flex items-center">
                    <h2 className="text-2xl font-bold">Create Post</h2>
                </div>

                {/* Select Community */}
                <div className="mb-5">
                    <form
                        onSubmit={handleCommunitySearch}
                        className="w-full max-w-80 mb-4"
                    >
                        <Popover
                            parentStyles={{ width: "100%" }}
                            className="!w-full rounded-xl overflow-hidden"
                            triggerType="manual"
                            contentVisible={communitySearch.visible}
                            onWrapperBlur={() =>
                                setCommunitySearch((prev) => ({
                                    ...prev,
                                    visible: false,
                                }))
                            }
                            indicator={false}
                            content={
                                <>
                                    {communitySearch.data.length === 0 ? (
                                        <p className="flex items-center justify-center px-4 py-3">
                                            <Spinner
                                                aria-label="Default"
                                                light
                                            />
                                        </p>
                                    ) : (
                                        communitySearch.data.map(
                                            (item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 px-4 py-3"
                                                    onClick={(e) => {
                                                        setPostValues(
                                                            (prev) => ({
                                                                ...prev,
                                                                community: item,
                                                            })
                                                        );
                                                        setCommunitySearch(
                                                            (prev) => ({
                                                                ...prev,
                                                                visible: false,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            item.profile_picture
                                                        }
                                                        alt="SubHiro Profile Picture"
                                                        className="rounded-full w-8 h-8"
                                                    />
                                                    <h3 className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            h/{item.hironame}
                                                        </span>
                                                        <span className="text-xs text-neutral-500 font-medium">
                                                            {item.members}{" "}
                                                            Members
                                                        </span>
                                                    </h3>
                                                </div>
                                            )
                                        )
                                    )}
                                </>
                            }
                        >
                            <div
                                className={`bg-slate-200 flex items-center gap-2 rounded-full px-3 py-2 border-2 border-slate-200 has-[input:focus]:border-primary ${
                                    targetPostId === undefined
                                        ? "cursor-text hover:bg-slate-300 hover:border-slate-300"
                                        : ""
                                }`}
                                onClick={(e) => {
                                    if (targetPostId !== undefined) return;
                                    const target = e.target as HTMLElement;
                                    target.querySelector("input")?.focus();
                                }}
                                title={
                                    targetPostId !== undefined
                                        ? "Can't Edit Community"
                                        : undefined
                                }
                            >
                                <span className="text-gray-600 text-xl">
                                    <IoSearchOutline />
                                </span>
                                <input
                                    type="text"
                                    className={`border-none outline-none text-sm w-full ${
                                        targetPostId !== undefined
                                            ? "pointer-events-none"
                                            : ""
                                    }`}
                                    placeholder="Search for Community"
                                    onFocus={() =>
                                        setCommunitySearch((prev) => ({
                                            ...prev,
                                            visible: prev.data.length > 0,
                                        }))
                                    }
                                    disabled={targetPostId !== undefined}
                                />
                            </div>
                        </Popover>
                    </form>

                    {postValues.community && (
                        <div className="flex items-end justify-between gap-2">
                            <div className="px-2">
                                <p className="font-semibold mb-2.5">
                                    <span className="">Community</span>
                                </p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            postValues.community.profile_picture
                                        }
                                        alt="SubHiro Profile Picture"
                                        className="rounded-full w-8 h-8"
                                    />
                                    <h3 className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            h/{postValues.community.hironame}
                                        </span>
                                        <span className="text-xs text-neutral-500 font-medium">
                                            {postValues.community.members}{" "}
                                            Members
                                        </span>
                                    </h3>
                                </div>
                            </div>

                            <RoundedButton
                                onClick={() =>
                                    setPostValues((prev) => ({
                                        ...prev,
                                        community: null,
                                    }))
                                }
                            >
                                <MdClose className="text-2xl" />
                            </RoundedButton>
                        </div>
                    )}
                </div>

                {/* Post Box */}
                <div>
                    <form onSubmit={handleSubmitPost}>
                        <label className="flex flex-col gap-2 mb-5">
                            <p className="px-2 font-semibold">
                                <span className="">Title</span>
                                <span className="text-red-600">*</span>
                            </p>
                            <input
                                type="text"
                                className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                                placeholder="Write post title"
                                maxLength={250}
                                minLength={5}
                                value={postValues.title}
                                onChange={(e) =>
                                    setPostValues((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                required
                            />
                            <p className="flex justify-end px-2 text-sm">
                                <span>{postValues.title.length} / 250</span>
                            </p>
                        </label>
                        <label className="flex flex-col gap-2 mb-5">
                            <p className="px-2 ">
                                <span className="font-semibold mr-2">Body</span>
                                <span className="text-xs">
                                    (Markdown Supported [?])
                                </span>
                            </p>
                            <textarea
                                className="w-full px-3.5 py-2.5 border-2 border-neutral-500 focus:border-[dodgerBlue] rounded-2xl outline-none text-sm"
                                placeholder="Write post title"
                                rows={5}
                                value={postValues.content}
                                onChange={(e) =>
                                    setPostValues((prev) => ({
                                        ...prev,
                                        content: e.target.value,
                                    }))
                                }
                            />
                        </label>

                        <div className="flex justify-end gap-3">
                            {/* <RoundedButton
                                className={`!px-6 ${
                                    postValues.title.length > 5
                                        ? "!bg-blue-700 hover:!bg-blue-800 !text-white"
                                        : "bg-neutral-300 !text-neutral-500 pointer-events-none"
                                }`}
                                disabled={postValues.title.length < 5}
                            >
                                <span className="text-sm font-semibold">
                                    Save Draft
                                </span>
                            </RoundedButton> */}
                            <RoundedButton
                                className={`!px-6 ${
                                    postValues.title.length < 5 ||
                                    isInsertPostLoading ||
                                    isUpdatePostLoading
                                        ? "bg-neutral-300 !text-neutral-500 pointer-events-none"
                                        : "!bg-blue-700 hover:!bg-blue-800 !text-white"
                                }`}
                                disabled={
                                    postValues.title.length < 5 ||
                                    isInsertPostLoading ||
                                    isUpdatePostLoading
                                }
                            >
                                {!isInsertPostLoading || isUpdatePostLoading ? (
                                    <span className="text-sm font-semibold">
                                        {targetPostId === undefined
                                            ? "Post"
                                            : "Update"}
                                    </span>
                                ) : (
                                    <Spinner size="sm" />
                                )}
                            </RoundedButton>
                        </div>
                    </form>
                </div>
            </MainDiv>

            <Sidebar>
                {/* Sidebar Content */}
                <div className="p-5 bg-slate-100/80 rounded-2xl">
                    <div className="flex justify-between items-center">
                        <h3 className="uppercase text-neutral-500 font-medium text-xs">
                            Your Posts
                        </h3>
                    </div>

                    {isUserPostsSuccess &&
                        userPosts.data.map(
                            (postData: PostInterface, idx: number) => (
                                <React.Fragment key={idx}>
                                    <SidebarPost postData={postData} />
                                    <div className="pb-0.5 mb-0.5 border-b border-neutral-300"></div>
                                </React.Fragment>
                            )
                        )}
                </div>

                <Footer />
            </Sidebar>
        </PageLayout>
    );
};

export default SubmitPost;
