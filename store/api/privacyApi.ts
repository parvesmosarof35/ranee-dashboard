import { baseApi } from "./baseApi";

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => ({
        url: "settings/find_by_privacy_policy",
        method: "GET",
      }),
      providesTags: ["privacy"],
    }),

    updatePrivacy: builder.mutation({
      query: (data) => ({
        url: "settings/privacy_policys",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["privacy"],
    }),
  }),
});

export const { useGetPrivacyQuery, useUpdatePrivacyMutation } = privacyApi;
