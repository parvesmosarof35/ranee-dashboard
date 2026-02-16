import { baseApi } from "./baseApi";

export const serviceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all services with pagination and filters
        getAllServices: builder.query({
            query: ({
                page = 1,
                limit = 10,
                searchTerm = "",
                category_id = "",
                type = "", // Online, Offline, Both
                time = "", // newest, lowest, etc. (probably sort order)
                instructor_id = "",
                price = "", // lowest, highest
            }: any = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page.toString());
                if (limit) params.append("limit", limit.toString());
                if (searchTerm) params.append("searchTerm", searchTerm);
                if (category_id) params.append("category_id", category_id);
                if (type) params.append("type", type);
                if (time) params.append("time", time);
                if (instructor_id) params.append("instructor_id", instructor_id);
                if (price) params.append("price", price);

                return {
                    url: `services/getallservices?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["service"],
        }),

        // Create service
        createService: builder.mutation({
            query: (formData) => ({
                url: "services/createService",
                method: "POST",
                body: formData, // FormData
            }),
            invalidatesTags: ["service"],
        }),

        // Update service
        updateService: builder.mutation({
            query: ({ id, formData }) => ({
                url: `services/updateservice/${id}`,
                method: "PATCH",
                body: formData, // FormData
            }),
            invalidatesTags: ["service"],
        }),

        // Delete service
        deleteService: builder.mutation({
            query: (id) => ({
                url: `services/deleteservice/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["service"],
        }),
    }),
});

export const {
    useGetAllServicesQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = serviceApi;

export default serviceApi;
