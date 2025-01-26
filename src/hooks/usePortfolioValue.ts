import { useMemo } from "react";
import Decimal from "decimal.js";

import {
  useGetCoinsQuery,
  useGetMyHoldingsQuery,
  useMeQuery,
} from "../store/api";
import { useAppSelector } from "../store/hooks";
import { selectEntities } from "../store/livePrices";

export function usePortfolioValue() {
  const { data: user } = useMeQuery();
  const { data: coins } = useGetCoinsQuery(undefined, { skip: !user });
  const { data: holdings } = useGetMyHoldingsQuery(undefined, {
    skip: !user,
  });
  const livePrices = useAppSelector(selectEntities);

  return useMemo(() => {
    if (!user || (!coins && !livePrices)) return;

    let value = new Decimal(user.balance);
    for (const holding of holdings) {
      const price = livePrices[holding.coinId]?.price
        ? livePrices[holding.coinId].price
        : coins?.find((coin) => coin.id === holding.coinId).currentPrice;
      const holdingValue = new Decimal(holding.shares).mul(price);

      value = value.add(holdingValue);
    }

    value = value.toDecimalPlaces(2);
    const change = value.sub(user.deposits);
    const changePercent = change.div(user.deposits).mul(100);
    return {
      value: value.toString(),
      change: change.toString(),
      changePercent: changePercent.toString(),
    };
  }, [user, coins, holdings, livePrices]);

  // const [change, changePercent] = useMemo(() => {
  //   if (!coin || !price) return [0, 0];

  //   const change = new Decimal(price).sub(coin.dayLow).toDecimalPlaces(2); // TODO: Add 24h ago field
  //   return [
  //     change.toString(),
  //     change.div(coin.dayLow).mul(100).toDecimalPlaces(2).toString(),
  //   ];
  // }, [coin, price]);

  // return {
  //   price,
  //   change,
  //   changePercent,
  // };
}
