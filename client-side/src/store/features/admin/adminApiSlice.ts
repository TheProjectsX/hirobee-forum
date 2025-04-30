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

        updateUserRole: builder.mutation({
            query: (data) => ({
                url: `/admin/users/${data.username}/role/${data.role}`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useFetchStatsQuery,
    useFetchUsersQuery,
    useUpdateUserRoleMutation,
} = adminApiSlice;
export default adminApiSlice;
