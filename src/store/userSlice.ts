import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from ".";
import { api, User } from "./api";

export interface AuthState {
  user?: User;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const endpoints = [
      api.endpoints.register,
      api.endpoints.login,
      api.endpoints.me,
    ];
    builder.addMatcher(
      (action) => endpoints.some((endpoint) => endpoint.matchFulfilled(action)),
      (state, { payload }: PayloadAction<User>) => {
        state.user = payload;
        state.isAuthenticated = true;
      },
    );

    builder.addMatcher(api.endpoints.logout.matchFulfilled, () => {
      return initialState;
    });
  },
});

export default userSlice.reducer;
