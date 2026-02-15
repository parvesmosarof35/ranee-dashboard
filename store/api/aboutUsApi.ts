import { baseApi } from "./baseApi";

const aboutUsApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
            getAboutUs: builder.query({
                  query: () => ({
                        url: 'settings/find_by_about_us',
                        method: 'GET',
                  }),
                  providesTags: ['aboutUs'],
            }),
            updateAboutUs: builder.mutation({
                  query: (data) => ({
                        url: 'settings/about',
                        method: 'POST',
                        body: data,
                  }),
                  invalidatesTags: ['aboutUs'],
            }),
      }),
});

export const {
      useGetAboutUsQuery,
      useUpdateAboutUsMutation
} = aboutUsApi;