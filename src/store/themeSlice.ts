import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from ".";

export type Theme = "light" | "dark";

export interface ThemeState {
  colorScheme: Theme;
  primaryColor: string;
}

const initialState: ThemeState = {
  colorScheme: "dark",
  primaryColor: "green",
};

export const selectColorScheme = (state: RootState) => state.theme.colorScheme;
export const selectPrimaryColor = (state: RootState) =>
  state.theme.primaryColor;

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColorScheme: (state, action: PayloadAction<Theme>) => {
      state.colorScheme = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
  },
});

export const { setColorScheme, setPrimaryColor } = themeSlice.actions;
export default themeSlice.reducer;
