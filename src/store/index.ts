import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import tickerReducer from "../components/Ticker/slice";
import securityBrowserReducer from "../components/SecurityBrowser/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ticker: tickerReducer,
    securityBrowser: securityBrowserReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
