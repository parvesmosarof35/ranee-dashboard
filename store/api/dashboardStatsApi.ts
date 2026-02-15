import { baseApi } from "./baseApi";

export interface DashboardStats {
  summary: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalCollections: number;
  };
}

export interface UserGrowthData {
  year: number;
  totalUsers: number;
  monthlyData: {
    month: string;
    totalUsers: number;
  }[];
}

export interface RecentOrder {
  orderNumber: string;
  customerName: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  totalAmount: number;
  items: any[]; // Define more specific type if needed
}

export interface RecentUser {
  name: string;
  email: string;
  registrationDate: string;
}

export const dashboardStatsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query<{ success: boolean; data: DashboardStats }, void>({
      query: () => ({
        url: "/dashboard/get-stats",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getUserGrowth: build.query<{ success: boolean; data: UserGrowthData }, number>({
      query: (year) => ({
        url: `/dashboard/user-growth?year=${year}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getRecentOrders: build.query<{ success: boolean; data: RecentOrder[] }, number | void>({
      query: (limit = 10) => ({
        url: `/dashboard/recent-orders?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
    getRecentUsers: build.query<{ success: boolean; data: RecentUser[] }, number | void>({
      query: (limit = 10) => ({
        url: `/dashboard/recent-users?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUserGrowthQuery,
  useGetRecentOrdersQuery,
  useGetRecentUsersQuery,
} = dashboardStatsApi;
