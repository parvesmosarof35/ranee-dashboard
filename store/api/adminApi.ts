import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create user
        createAdmin: builder.mutation({
            query: (userData) => ({
                url: "user/create_user",
                method: "POST",
                body: userData, // expects JSON
            }),
            invalidatesTags: ["admin", "dashboard"],
        }),
        // Get all admins with pagination
        getAllAdmins: builder.query({
            query: ({ limit = 10, page = 1 }: any = {}) =>
                `auth/find_by_all_admin?limit=${limit}&page=${page}`,
            providesTags: ["admin"],
        }),
        // Delete admin
        deleteAdmin: builder.mutation({
            query: (id) => ({
                url: `user/delete_user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["admin", "dashboard"],
        }),
        // Get all consultants
        getAllConsultants: builder.query({
            query: ({ limit = 10, page = 1 }: any = {}) =>
                `user/getallconsult?limit=${limit}&page=${page}`,
            providesTags: ["admin"],
        }),
        // Get all bookings
        getAllBookings: builder.query({
            query: ({ page = 1, limit = 10, consultantid = "", status = "" }: any = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page.toString());
                if (limit) params.append("limit", limit.toString());
                if (consultantid) params.append("consultantid", consultantid);
                if (status) params.append("status", status);
                return `bookings/get_all_booked_data_for_admin?${params.toString()}`;
            },
            providesTags: ["admin"],
        }),
    }),
});
export const {
    useCreateAdminMutation,
    useGetAllAdminsQuery,
    useDeleteAdminMutation,
    useGetAllConsultantsQuery,
    useGetAllBookingsQuery,
} = adminApi;

export default adminApi;