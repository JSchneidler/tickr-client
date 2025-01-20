import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import user from "./userSlice";
import theme from "./themeSlice";
import ticker from "../components/Ticker/slice";
import securityBrowser from "../components/SecurityBrowser/slice";

export const store = configureStore({
  reducer: {
    user,
    theme,
    ticker,
    securityBrowser,
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
