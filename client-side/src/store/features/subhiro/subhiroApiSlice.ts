import baseApiSlice from "@/store/app/baseApi/baseApiSlice";

const subhiroApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchSubhiro: builder.query({
            query: (data) => ({
                url: `/subhiro/${data.subhiroId}`,
            }),
        }),
        fetchSubhiroPosts: builder.query({
            query: (data) => ({
                url: `/subhiro/${data.subhiroId}/posts`,
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

export const { useFetchSubhiroQuery, useFetchSubhiroPostsQuery } =
    subhiroApiSlice;

export default subhiroApiSlice;
