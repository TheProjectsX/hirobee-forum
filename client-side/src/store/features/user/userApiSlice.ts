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
        submitPost: builder.mutation({
            query: (data) => ({
                url: "/me/posts",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useFetchUserInfoQuery,
    useFetchUserPostsQuery,
    useFetchSinglePostQuery,
    useSubmitPostMutation,
} = userApiSlice;
export default userApiSlice;
