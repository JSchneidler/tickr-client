import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";

import { api } from "./api";
import theme from "./themeSlice";
import livePrices from "./livePrices";
import { webSocketMiddleware } from "./webSocketMiddleware";

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    livePrices,
    theme,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(webSocketMiddleware),
});

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>;
