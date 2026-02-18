import { baseApi } from "./baseApi";

export const dashboardStatsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query({
      query: () => ({
        url: "/dashboardstats/get-stats",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getUserGrowth: build.query({
      query: (year) => ({
        url: `/dashboardstats/user-growth?year=${year}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getRecentUsers: build.query({
      query: (limit = 10) => ({
        url: `/dashboardstats/recent-users?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getConsultantTotalServices: build.query({
      query: () => ({
        url: "/dashboardstats/consultants_total_services",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getConsultantTotalClients: build.query({
      query: () => ({
        url: "/dashboardstats/consultants_total_clients",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getConsultantTotalEarnings: build.query({
      query: () => ({
        url: "/dashboardstats/consultants_total_earnings",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getConsultantServedClients: build.query({
      query: ({ page = 1, limit = 10 }: any = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (limit) params.append("limit", limit.toString());
        return {
          url: `/dashboardstats/consultants_served_clients?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUserGrowthQuery,
  useGetRecentUsersQuery,
  useGetConsultantTotalServicesQuery,
  useGetConsultantTotalClientsQuery,
  useGetConsultantTotalEarningsQuery,
  useGetConsultantServedClientsQuery,
} = dashboardStatsApi;
