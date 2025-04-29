import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchStats: builder.query({
            query: () => "/admin/stats",
        }),
    }),
});

export const { useFetchStatsQuery } = adminApiSlice;
export default adminApiSlice;
