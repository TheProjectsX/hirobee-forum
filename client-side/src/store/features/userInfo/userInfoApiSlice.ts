import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const userInfoApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUserInfo: builder.query({ query: () => "/me" }),
    }),
});

export const { useFetchUserInfoQuery } = userInfoApiSlice;
export default userInfoApiSlice;
