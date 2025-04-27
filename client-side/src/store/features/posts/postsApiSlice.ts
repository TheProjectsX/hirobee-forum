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
                url: `/posts/${data.postId}/upvote`,
                method: "PUT",
            }),
        }),
        updateDownvote: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/downvote`,
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
