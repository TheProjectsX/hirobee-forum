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
                url: `/comments/${data.commentId}`,
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
        updateCommentUpvote: builder.mutation({
            query: (data) => ({
                url: `/comments/${data.commentId}/upvote`,
                method: "PUT",
            }),
        }),
        updateCommentDownvote: builder.mutation({
            query: (data) => ({
                url: `/comments/${data.commentId}/downvote`,
                method: "PUT",
            }),
        }),
        reportComment: builder.mutation({
            query: (data) => ({
                url: `/comments/${data.commentId}/report`,
                method: "POST",
                body: data.body,
            }),
        }),
    }),
});

export const {
    useFetchCommentsQuery,
    useInsertCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useUpdateCommentUpvoteMutation,
    useUpdateCommentDownvoteMutation,
    useReportCommentMutation,
} = commentsApiSlice;
export default commentsApiSlice;
