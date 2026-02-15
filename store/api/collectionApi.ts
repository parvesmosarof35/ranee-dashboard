import { baseApi } from "./baseApi";

export const collectionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create collection
        createCollection: builder.mutation({
            query: (formData) => ({
                url: "collection",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["collection", "dashboard"],
        }),

        // Get all collection
        getAllCollections: builder.query({
            query: (params) => ({
                url: "collection",
                method: "GET",
                params, // e.g., { page: 1, limit: 10 }
            }),
            providesTags: ["collection"],
        }),


        //  update collection
        updateCollection: builder.mutation({
            query: ({ id, formData }) => ({
                url: `collection/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["collection"],
        }),

        // delete collection
        deleteCollection: builder.mutation({
            query: (id) => ({
                url: `collection/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["collection", "dashboard"],
        }),
    }),
});

export const {
    useCreateCollectionMutation,
    useGetAllCollectionsQuery,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
} = collectionApi;
