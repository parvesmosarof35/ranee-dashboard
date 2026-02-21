import { baseApi } from "./baseApi";

export const discountApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create Discount
        createDiscount: builder.mutation({
            query: (data) => ({
                url: "discounts/creatediscount",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["discount"],
        }),
        // Get All Discounts
        getAllDiscounts: builder.query({
            query: () => "discounts/getalldiscounts",
            providesTags: ["discount"],
        }),
        // Get Single Discount by ID
        getDiscountById: builder.query({
            query: (id) => `discounts/getdiscount/${id}`,
            providesTags: (result, error, id) => [{ type: "discount", id }],
        }),
        // Update Discount
        updateDiscount: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `discounts/updatediscount/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["discount"],
        }),
        // Delete Discount
        deleteDiscount: builder.mutation({
            query: (id) => ({
                url: `discounts/deletediscount/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["discount"],
        }),
    }),
});

export const {
    useCreateDiscountMutation,
    useGetAllDiscountsQuery,
    useGetDiscountByIdQuery,
    useUpdateDiscountMutation,
    useDeleteDiscountMutation,
} = discountApi;

export default discountApi;
