import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const userApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUserInfo: builder.query({ query: () => "/me" }),
        fetchUserPosts: builder.query({
            query: (params) => ({
                url: "/me/posts",
                params,
            }),
        }),
        fetchSinglePost: builder.query({
            query: (data) => `/me/posts/${data.postId}`,
        }),
        insertPost: builder.mutation({
            query: (data) => ({
                url: "/me/posts",
                method: "POST",
                body: data.body,
            }),
        }),
        updatePost: builder.mutation({
            query: (data) => ({
                url: `/me/posts/${data.postId}`,
                method: "PUT",
                body: data.body,
            }),
        }),
        deletePost: builder.mutation({
            query: (data) => ({
                url: `/me/posts/${data.postId}`,
                method: "DELETE",
            }),
        }),
        joinSubhiro: builder.mutation({
            query: (data) => ({
                url: `/me/subhiro/${data.subhiroId}/join`,
                method: "PUT",
            }),
        }),
        leaveSubhiro: builder.mutation({
            query: (data) => ({
                url: `/me/subhiro/${data.subhiroId}/leave`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useFetchUserInfoQuery,
    useFetchUserPostsQuery,
    useFetchSinglePostQuery,
    useInsertPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useJoinSubhiroMutation,
    useLeaveSubhiroMutation,
} = userApiSlice;
export default userApiSlice;
