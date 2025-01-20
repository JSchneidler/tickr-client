import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../../store";

export interface Price {
  coin: string;
  price: number;
  change: number;
  change_percent: number;
}

export type Prices = Record<string, Price>;

export type Status = "idle" | "loading" | "failed";

export interface TickerState {
  prices: Price[];
  status: Status;
}

const initialState: TickerState = {
  prices: [],
  status: "loading",
};

export const selectPrices = (state: RootState) => state.ticker.prices;
export const selectStatus = (state: RootState) => state.ticker.status;

export const tickerSlice = createSlice({
  name: "ticker",
  initialState,
  reducers: {
    setPrices: (state, action: PayloadAction<Price[]>) => {
      state.prices = action.payload;
    },
    setStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
  },
});

export const { setPrices, setStatus } = tickerSlice.actions;

export default tickerSlice.reducer;
