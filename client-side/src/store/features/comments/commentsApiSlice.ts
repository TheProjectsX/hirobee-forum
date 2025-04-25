import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const commentsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchComments: builder.query({
            query: (postId) => ({
                url: `/posts/${postId}/comments`,
            }),
        }),
    }),
});

export const { useFetchCommentsQuery } = commentsApiSlice;
export default commentsApiSlice;
