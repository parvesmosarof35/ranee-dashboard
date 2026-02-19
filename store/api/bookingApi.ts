import { baseApi } from "./baseApi";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all booked data for consultant
        getAllBookedDataForConsultant: builder.query({
            query: ({
                page = 1,
                limit = 10,
                status = "", // "Pending", "Paid", "Failed", "Cancelled"
                date = "", // YYYY-MM-DD
            }: any = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page.toString());
                if (limit) params.append("limit", limit.toString());
                if (status) params.append("status", status);
                if (date) params.append("date", date);

                return {
                    url: `bookings/get_all_booked_data_for_consultant?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["Booking"],
        }),
    }),
});

export const {
    useGetAllBookedDataForConsultantQuery,
} = bookingApi;

export default bookingApi;
