import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../../store";

export interface Security {
  // Symbol
  id: number;
  name: string;
  displayName: string;
  description: string;
  mic: string;
  figi: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  // Company Info
  companyName: string;
  companyDescription: string;
  homepageUrl: string;
  marketCap: number;
  sic_code: string;
  sic_description: string;
  total_employees: number;

  // Quote
  // price: number;
  // open_price: number;
  // change: number;
  // change_percent: number;
}

export type Status = "idle" | "loading" | "failed";

export interface SecurityBrowserState {
  security?: Security;
  status: Status;
}

const API_BASE_URL = "http://localhost:3000/api";

const initialState: SecurityBrowserState = {
  status: "idle",
};

export const selectSecurity = (state: RootState) =>
  state.securityBrowser.security;
export const selectStatus = (state: RootState) => state.securityBrowser.status;

export const fetchSecurity = createAsyncThunk(
  "security/fetch",
  async (symbol: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/symbol/${symbol}`, {
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      const data = await response.json();

      return data;
    } catch {
      return rejectWithValue("Fetch security failed");
    }
  },
);

export const securityBrowserSlice = createSlice({
  name: "securityBrowser",
  initialState,
  reducers: {
    setSecurity: (state, action: PayloadAction<Security>) => {
      state.security = action.payload;
    },
    setStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(fetchSecurity.pending, (state) => {
      state.status = "loading";
      // state.error = null;
    });
    builder.addCase(fetchSecurity.fulfilled, (state, action) => {
      state.status = "idle";
      state.security = action.payload;
    });
    builder.addCase(fetchSecurity.rejected, (state, action) => {
      state.status = "failed";
      // state.error = action.payload as string;
    });
  },
});

export const { setSecurity, setStatus } = securityBrowserSlice.actions;

export default securityBrowserSlice.reducer;
