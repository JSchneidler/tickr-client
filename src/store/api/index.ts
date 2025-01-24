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
    // prepareHeaders: (headers, { getState }) => {
    //   const token = selectToken(getState() as RootState);
    //   if (token) headers.set("Authorization", `Bearer ${token}`);
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation<User, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    me: builder.query<User, void>({
      query: () => "/me",
    }),

    // Coins
    getCoins: builder.query<Coin[], void>({
      query: () => "/coins",
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
    }),

    // Orders
    getMyOrders: builder.query<Order[], boolean>({
      query: (active) => `/me/orders${active ? "?active=true" : ""}`,
    }),
    createOrder: builder.mutation<Order, OrderRequest>({
      query: (orderRequest) => ({
        url: "/orders",
        method: "POST",
        body: orderRequest,
      }),
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
} = api;
