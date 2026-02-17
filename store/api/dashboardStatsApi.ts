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
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUserGrowthQuery,
  useGetRecentUsersQuery,
} = dashboardStatsApi;
