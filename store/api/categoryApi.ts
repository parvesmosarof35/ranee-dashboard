import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllCategories: build.query({
            query: ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => ({
                url: `/categories/getallcategories?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["category"],
        }),
        createCategory: build.mutation({
            query: (data) => ({
                url: "/categories/createcategory",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["category"],
        }),
        deleteCategory: build.mutation({
            query: (id) => ({
                url: `/categories/deletecategory/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["category"],
        }),
        updateCategory: build.mutation({
            query: ({ id, data }) => ({
                url: `/categories/updatecategory/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["category"],
        }),
    }),
});

export const { useGetAllCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } = categoryApi;
