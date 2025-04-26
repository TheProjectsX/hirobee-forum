import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const postsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchPosts: builder.query({
            query: (data) => ({
                url: "/posts",
            }),
        }),
        addUpvote: builder.mutation({
            query: (postId) => ({
                url: `/posts/${postId}/upvote/add`,
                method: "PUT",
            }),
        }),
        addDownvote: builder.mutation({
            query: (postId) => ({
                url: `/posts/${postId}/downvote/add`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useFetchPostsQuery,
    useAddUpvoteMutation,
    useAddDownvoteMutation,
} = postsApiSlice;
export default postsApiSlice;
