import { useMemo } from "react";
import Decimal from "decimal.js";

import { useGetCoinQuery } from "../store/api";
import { useAppSelector } from "../store/hooks";
import { selectById } from "../store/livePrices";

export function useLivePrice(coinId: number) {
  const { data: coin } = useGetCoinQuery(coinId, { skip: !coinId });
  const livePrice = useAppSelector((state) => selectById(state, coinId));

  const price = livePrice?.price ? livePrice.price : coin?.currentPrice;

  const [change, changePercent] = useMemo(() => {
    if (!coin || !price) return [0, 0];

    const change = new Decimal(price).sub(coin.dayLow).toDecimalPlaces(2); // TODO: Add 24h ago field
    return [
      change.toString(),
      change.div(coin.dayLow).mul(100).toDecimalPlaces(2).toString(),
    ];
  }, [coin, price]);

  return {
    price,
    change,
    changePercent,
  };
}
