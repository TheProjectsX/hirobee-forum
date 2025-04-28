import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const postsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchPosts: builder.query({
            query: (data) => ({
                url: "/posts",
                params: data.params ?? {},
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newData, { arg }) => {
                const { page } = arg.params ?? {};
                if (!page || page === 1) {
                    return newData;
                }

                return {
                    data: [...currentCache.data, ...newData.data],
                    pagination: newData.pagination,
                };
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        updatePostUpvote: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/upvote`,
                method: "PUT",
            }),
        }),
        updatePostDownvote: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/downvote`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useFetchPostsQuery,
    useUpdatePostUpvoteMutation,
    useUpdatePostDownvoteMutation,
} = postsApiSlice;
export default postsApiSlice;
