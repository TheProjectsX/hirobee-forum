import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const usersApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchSpecificUserPosts: builder.query({
            query: (data) => ({
                url: `/users/${data.username}/posts`,
                params: data.params ?? {},
            }),
        }),
        fetchSpecificUserComments: builder.query({
            query: (data) => ({
                url: `/users/${data.username}/comments`,
                params: data.params ?? {},
            }),
        }),
    }),
});

export const {
    useFetchSpecificUserPostsQuery,
    useFetchSpecificUserCommentsQuery,
} = usersApiSlice;
export default usersApiSlice;
