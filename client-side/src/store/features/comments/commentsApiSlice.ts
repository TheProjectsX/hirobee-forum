import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const commentsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchComments: builder.query({
            query: (data) => ({
                url: `/posts/${data.postId}/comments`,
            }),
        }),
        insertComment: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/comments`,
                method: "POST",
                body: data.body,
            }),
        }),
        updateComment: builder.mutation({
            query: (data) => ({
                url: `/comments/${data.postId}`,
                method: "PUT",
                body: data.body,
            }),
        }),
        deleteComment: builder.mutation({
            query: (data) => ({
                url: `/comments/${data.commentId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useFetchCommentsQuery,
    useInsertCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentsApiSlice;
export default commentsApiSlice;
