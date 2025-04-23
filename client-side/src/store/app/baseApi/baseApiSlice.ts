import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApiSlice = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
    }),
    endpoints: (builder) => ({}),
});

export default baseApiSlice;
