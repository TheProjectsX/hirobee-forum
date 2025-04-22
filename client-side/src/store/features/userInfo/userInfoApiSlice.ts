import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const userInfoApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builders) => ({
        fetchInfo: builders.query({ query: () => "/me" }),
    }),
});

export const { useFetchInfoQuery } = userInfoApiSlice;
export default userInfoApiSlice;
