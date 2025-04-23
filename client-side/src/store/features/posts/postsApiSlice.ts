import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const postsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchPosts: builder.query({
            query: (data) => ({
                url: "/posts",
            }),
        }),
    }),
});

export const { useFetchPostsQuery } = postsApiSlice;
export default postsApiSlice;
