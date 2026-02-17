
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logIn: builder.mutation({
      query: (data) => {
        return {
          url: "auth/login_user",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "user/create_user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "dashboard"],
    }),


    getMyProfile: builder.query({
      query: () => ({
        url: "auth/myprofile",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "auth/update_my_profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["auth"],
    }),



    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "user/forgot_password",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "user/verification_forgot_user",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ userId, password }) => {
        return {
          url: "user/reset_password",
          method: "POST",
          body: { userId, password },
        };
      },
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "user/change_password",
        method: "PATCH",
        body: data,
      }),
    }),

    userVarification: builder.mutation({
      query: (data) => ({
        url: "user/user_verification",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: `/auth/get_single_user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    guestLogin: builder.mutation({
      query: (data) => ({
        url: "user/guest_login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    googleLogin: builder.mutation({
      query: (data) => ({
        url: "auth/login_with_google",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    findAllUsers: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = "" }: any = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        if (searchTerm) params.append("searchTerm", searchTerm);

        return {
          url: `auth/find_by_admin_all_users?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/delete_user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

  }),
});



export const {
  useLogInMutation,
  useCreateUserMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useUserVarificationMutation,
  useChangePasswordMutation,
  useGetSingleUserQuery,
  useGuestLoginMutation,
  useGoogleLoginMutation,
  useFindAllUsersQuery,
  useDeleteUserMutation,
} = authApi;

export default authApi;