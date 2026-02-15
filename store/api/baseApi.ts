import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../config/envConfig";


export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const state: any = getState();
      const token = state?.auth?.token;
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "admin",
    "dashboard",
    "user",
    "subscription",
    "auth",
    "plates_sales",
    "User",
    "faq",
    "aboutUs",
    "termsAndConditions",
    "privacy",
    "contact",
    "blog",
    "collection",
    "product",
    "products",
    "cart",
    "wishlist",
    "Order",
    "reviews",
    "Hero",
  ],
});
