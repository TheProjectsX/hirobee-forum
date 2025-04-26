import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const postsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchPosts: builder.query({
            query: (data) => ({
                url: "/posts",
            }),
        }),
        updateUpvote: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/upvote/${data.action}`,
                method: "PUT",
            }),
        }),
        updateDownvote: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/downvote/${data.action}`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useFetchPostsQuery,
    useUpdateUpvoteMutation,
    useUpdateDownvoteMutation,
} = postsApiSlice;
export default postsApiSlice;
