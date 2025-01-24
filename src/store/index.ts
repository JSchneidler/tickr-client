import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "./api";
import user from "./userSlice";
import theme from "./themeSlice";
// import ticker from "../components/Ticker/slice";

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user,
    theme,
    // ticker,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>;
