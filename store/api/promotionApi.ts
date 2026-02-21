import { baseApi } from "./baseApi";

export const promotionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Website Promotions
        getWebsitePromotions: builder.query({
            query: () => "settings/website_promotion_option",
            providesTags: ["Promotion"],
        }),
        createWebsitePromotion: builder.mutation({
            query: (data) => ({
                url: "settings/website_promotion_option",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Promotion"],
        }),
        updateWebsitePromotion: builder.mutation({
            query: ({ id, data }) => ({
                url: `settings/website_promotion_option/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Promotion"],
        }),
        deleteWebsitePromotion: builder.mutation({
            query: (id) => ({
                url: `settings/website_promotion_option/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Promotion"],
        }),

        // Product Promotions
        getProductPromotions: builder.query({
            query: () => "settings/product_promotion_option",
            providesTags: ["Promotion"],
        }),
        createProductPromotion: builder.mutation({
            query: (data) => ({
                url: "settings/product_promotion_option",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Promotion"],
        }),
        updateProductPromotion: builder.mutation({
            query: ({ id, data }) => ({
                url: `settings/product_promotion_option/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Promotion"],
        }),
        deleteProductPromotion: builder.mutation({
            query: (id) => ({
                url: `settings/product_promotion_option/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Promotion"],
        }),

        // Vendors Promotions
        getVendorsPromotions: builder.query({
            query: () => "settings/vendors_promotion_option",
            providesTags: ["Promotion"],
        }),
        createVendorsPromotion: builder.mutation({
            query: (data) => ({
                url: "settings/vendors_promotion_option",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Promotion"],
        }),
        updateVendorsPromotion: builder.mutation({
            query: ({ id, data }) => ({
                url: `settings/vendors_promotion_option/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Promotion"],
        }),
        deleteVendorsPromotion: builder.mutation({
            query: (id) => ({
                url: `settings/vendors_promotion_option/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Promotion"],
        }),
    }),
});

export const {
    useGetWebsitePromotionsQuery,
    useCreateWebsitePromotionMutation,
    useUpdateWebsitePromotionMutation,
    useDeleteWebsitePromotionMutation,
    useGetProductPromotionsQuery,
    useCreateProductPromotionMutation,
    useUpdateProductPromotionMutation,
    useDeleteProductPromotionMutation,
    useGetVendorsPromotionsQuery,
    useCreateVendorsPromotionMutation,
    useUpdateVendorsPromotionMutation,
    useDeleteVendorsPromotionMutation,
} = promotionApi;
