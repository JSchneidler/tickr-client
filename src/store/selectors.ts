import { createSelector } from "@reduxjs/toolkit";
import {
  BaseQueryFn,
  TypedUseQueryStateResult,
} from "@reduxjs/toolkit/query/react";

import { Holding } from "./api/schema";

type GetHoldingSelectFromResultArg = TypedUseQueryStateResult<
  Holding[],
  undefined,
  BaseQueryFn
>;

export const selectHoldingForCoin = createSelector(
  (res: GetHoldingSelectFromResultArg) => res.data,
  (_: GetHoldingSelectFromResultArg, coinId?: number) => coinId,
  (holdings, coinId) => holdings?.find((holding) => holding.coinId === coinId),
);
