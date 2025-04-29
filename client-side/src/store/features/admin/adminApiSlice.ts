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
    }),
});

export const {
    useFetchStatsQuery,
    useFetchUsersQuery,
    useLazyFetchReportedUsersQuery,
    useFetchReportedPostsQuery,
    useLazyFetchReportedCommentsQuery,
} = adminApiSlice;
export default adminApiSlice;
