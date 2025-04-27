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
    }),
});

export const {
    useFetchUserInfoQuery,
    useFetchUserPostsQuery,
    useFetchSinglePostQuery,
    useInsertPostMutation,
    useUpdatePostMutation,
} = userApiSlice;
export default userApiSlice;
