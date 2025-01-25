import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  User,
  RegisterRequest,
  LoginRequest,
  Coin,
  CoinWithQuote,
  Holding,
  Order,
  OrderRequest,
  CoinHistoricalData,
} from "./schema";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["User", "Coin", "Holding", "Order"],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation<User, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    me: builder.query<User | undefined, void>({
      query: () => "/me",
      providesTags: ["User"], // TODO: Doesn't provide tag if fails?
    }),

    // Coins
    getCoins: builder.query<Coin[], void>({
      query: () => "/coins",
      providesTags: ["Coin"],
    }),
    getCoin: builder.query<CoinWithQuote, number>({
      query: (coinId) => `/coins/${coinId}`,
    }),
    getCoinHistoricalData: builder.query<CoinHistoricalData, number>({
      query: (coinId) => `/coins/${coinId}/historical`,
    }),

    // Holdings
    getMyHoldings: builder.query<Holding[], void>({
      query: () => "/me/holdings",
      providesTags: ["Holding"],
    }),

    // Orders
    getMyOrders: builder.query<Order[], void>({
      query: () => "/me/orders",
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<Order, OrderRequest>({
      query: (orderRequest) => ({
        url: "/orders",
        method: "POST",
        body: orderRequest,
      }),
      async onQueryStarted(order, lifecycleApi) {
        lifecycleApi.dispatch(
          api.util.updateQueryData("getMyOrders", undefined, (draft) => {
            draft.push({ ...order, id: 0, filled: false });
          }),
        );
      },
    }),
    deleteOrder: builder.mutation<void, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
      async onQueryStarted(orderId, lifecycleApi) {
        lifecycleApi.dispatch(
          api.util.updateQueryData("getMyOrders", undefined, (draft) => {
            Object.assign(
              draft,
              draft.filter((order) => order.id !== orderId),
            );
          }),
        );
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useGetCoinsQuery,
  useGetCoinQuery,
  useGetCoinHistoricalDataQuery,
  useGetMyHoldingsQuery,
  useLazyGetMyHoldingsQuery,
  useGetMyOrdersQuery,
  useLazyGetMyOrdersQuery,
  useCreateOrderMutation,
  useDeleteOrderMutation,
} = api;
