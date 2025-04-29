import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const usersApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchSpecificUserPosts: builder.query({
            query: (data) => ({
                url: `/users/${data.username}/posts`,
                params: data.params ?? {},
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newData, { arg }) => {
                const { page } = arg.params ?? {};
                if (!page || page === 1) {
                    return newData;
                }

                return {
                    data: [...currentCache.data, ...newData.data],
                    pagination: newData.pagination,
                };
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        fetchSpecificUserComments: builder.query({
            query: (data) => ({
                url: `/users/${data.username}/comments`,
                params: data.params ?? {},
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newData, { arg }) => {
                const { page } = arg.params ?? {};
                if (!page || page === 1) {
                    return newData;
                }

                return {
                    data: [...currentCache.data, ...newData.data],
                    pagination: newData.pagination,
                };
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
    }),
});

export const {
    useFetchSpecificUserPostsQuery,
    useFetchSpecificUserCommentsQuery,
} = usersApiSlice;
export default usersApiSlice;
