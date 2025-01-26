import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import { LivePrice } from "./api/schema";

const pricesAdapter = createEntityAdapter({
  selectId: (livePrice: LivePrice) => livePrice.coinId,
});

const livePricesSlice = createSlice({
  name: "livePrices",
  initialState: pricesAdapter.getInitialState(),
  reducers: {
    pricesUpdated(state, action: PayloadAction<LivePrice[]>) {
      pricesAdapter.setAll(state, action.payload);
    },
  },
});

export const { selectById, selectEntities } =
  pricesAdapter.getSelectors<RootState>((state) => state.livePrices);
export const { pricesUpdated } = livePricesSlice.actions;
export default livePricesSlice.reducer;
