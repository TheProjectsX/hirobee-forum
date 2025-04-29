import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchStats: builder.query({
            query: () => "/admin/stats",
        }),
        fetchUsers: builder.query({
            query: (data) => ({
                url: "/admin/users",
                params: data.params ?? {},
            }),
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        fetchReportedUsers: builder.query({
            query: (data) => ({
                url: "/admin/reported/users",
                params: data.params ?? {},
            }),
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        fetchReportedPosts: builder.query({
            query: (data) => ({
                url: "/admin/reported/posts",
                params: data.params ?? {},
            }),
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        fetchReportedComments: builder.query({
            query: (data) => ({
                url: "/admin/reported/comments",
                params: data.params ?? {},
            }),
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        updateUserRole: builder.mutation({
            query: (data) => ({
                url: `/admin/users/${data.username}/role/${data.role}`,
                method: "PUT",
            }),
        }),
        updateUserStatus: builder.mutation({
            query: (data) => ({
                url: `/admin/users/${data.username}/status/${data.status}`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useFetchStatsQuery,
    useFetchUsersQuery,
    useFetchReportedUsersQuery,
    useFetchReportedPostsQuery,
    useFetchReportedCommentsQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
} = adminApiSlice;
export default adminApiSlice;
