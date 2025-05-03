import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const moderatorApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchReportedUsers: builder.query({
            query: (data) => ({
                url: "/moderator/reported/users",
                params: data.params ?? {},
            }),
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        fetchReportedPosts: builder.query({
            query: (data) => ({
                url: "/moderator/reported/posts",
                params: data.params ?? {},
            }),
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        fetchReportedComments: builder.query({
            query: (data) => ({
                url: "/moderator/reported/comments",
                params: data.params ?? {},
            }),
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        updateUserStatus: builder.mutation({
            query: (data) => ({
                url: `/moderator/users/${data.username}/status/${data.status}`,
                method: "PUT",
            }),
        }),
        ignoreReport: builder.mutation({
            query: (data) => ({
                url: `/moderator/reports/${data.reportId}/ignore`,
                method: "PUT",
            }),
        }),
        approveReport: builder.mutation({
            query: (data) => ({
                url: `/moderator/reports/${data.reportId}/approve`,
                method: "PUT",
            }),
        }),
        createSubhiro: builder.mutation({
            query: (data) => ({
                url: "/moderator/subhiro",
                method: "POST",
                body: data.body,
            }),
        }),
        updateSubhiro: builder.mutation({
            query: (data) => ({
                url: `/moderator/subhiro/${data.subhiroId}`,
                method: "PUT",
                body: data.body,
            }),
        }),
    }),
});

export const {
    useFetchReportedUsersQuery,
    useFetchReportedPostsQuery,
    useFetchReportedCommentsQuery,
    useUpdateUserStatusMutation,
    useIgnoreReportMutation,
    useApproveReportMutation,
    useCreateSubhiroMutation,
    useUpdateSubhiroMutation,
} = moderatorApiSlice;

export default moderatorApiSlice;
