import { baseApi } from "./baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    // Create new Contact
    createContact: builder.mutation({
      query: (data) => ({
        url: "contact/create_contact",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contact"],
    }),

    // Get all Contacts with optional search/filter
    getAllContact: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" }: any = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (searchTerm) params.append("searchTerm", searchTerm);

        return {
          url: `contact/all_contact?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["contact"],
    }),

    // Delete Contact
    deleteContact: builder.mutation({
      query: (_id) => ({
        url: `contact/delete_contact/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),


  }),
});

export const {
  useGetAllContactQuery,
  useCreateContactMutation,
  useDeleteContactMutation,
} = contactApi;

export default contactApi;