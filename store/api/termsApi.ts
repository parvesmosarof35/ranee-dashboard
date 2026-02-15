import { baseApi } from "./baseApi";

const termsAndConditionsApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
            getTermsAndConditions: builder.query({
                  query: () => ({
                        url: "settings/find_by_terms_conditions",
                        method: "GET",
                  }),
                  providesTags: ["termsAndConditions"],
            }),
            updateTermsAndConditions: builder.mutation({
                  query: (data) => ({
                        url: "settings/terms_conditions",
                        method: "POST",
                        body: data,
                  }),
                  invalidatesTags: ["termsAndConditions"],
            }),
      }),
});

export const {
      useGetTermsAndConditionsQuery,
      useUpdateTermsAndConditionsMutation
} = termsAndConditionsApi;