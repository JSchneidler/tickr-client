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
  companyName: string | null;
  companyDescription: string | null;
  homepageUrl: string | null;
  marketCap: number | null;
  sic_code: string | null;
  sic_description: string | null;
  total_employees: number | null;

  // Quote
  currentPrice: string;
  openPrice: string;
  change: string;
  changePercent: string;
  dayHigh: string;
  dayLow: string;
  previousClose: string;
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
      const response = await fetch(`${API_BASE_URL}/symbols/${symbol}`, {
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      const data = await response.json();

      return data;
    } catch {
      return rejectWithValue("Fetch security failed");
    }
  },
);

export const buySecurity = createAsyncThunk(
  "security/buy",
  async (buyOrder, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        body: {
          symbolId: buyOrder.symbolId,
          shares: buyOrder.shares.toString(),
          direction: "SELL",
          type: "MARKET",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        rejectWithValue(error);
      }
    } catch {
      return rejectWithValue;
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
    builder.addCase(fetchSecurity.fulfilled, (state, action: PayloadAction) => {
      state.status = "idle";
      state.security = action.payload;
    });
    builder.addCase(fetchSecurity.rejected, (state, action: PayloadAction) => {
      state.status = "failed";
      // state.error = action.payload as string;
    });
  },
});

export const { setSecurity, setStatus } = securityBrowserSlice.actions;

export default securityBrowserSlice.reducer;
