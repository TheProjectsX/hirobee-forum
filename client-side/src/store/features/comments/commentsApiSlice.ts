import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const commentsApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchComments: builder.query({
            query: (data) => ({
                url: `/posts/${data.postId}/comments`,
            }),
        }),
        submitComment: builder.mutation({
            query: (data) => ({
                url: `/posts/${data.postId}/comments`,
                method: "POST",
                body: data.body,
            }),
        }),
    }),
});

export const { useFetchCommentsQuery, useSubmitCommentMutation } =
    commentsApiSlice;
export default commentsApiSlice;
