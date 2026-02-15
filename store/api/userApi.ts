import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (params) => ({
        url: "auth/find_by_admin_all_users",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["user"],
    }),
    changeStatus: builder.mutation({
      query: (data) => ({
        url: `auth/change_status/${data?.id}`,
        method: "PATCH",
        body: data.status,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/delete_user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
  }),
});
 
// asdf

export const {
  useGetAllUserQuery,
  useChangeStatusMutation,
  useDeleteUserMutation,
} = userApi;
