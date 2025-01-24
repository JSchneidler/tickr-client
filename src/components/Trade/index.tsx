import { useState } from "react";
import {
  Title,
  // Loader,
  Container,
  Text,
  Divider,
  Stack,
  Group,
  NumberFormatter,
} from "@mantine/core";
import Decimal from "decimal.js";

import CoinSelector from "../CoinSelector";
import { useGetCoinQuery, useGetMyHoldingsQuery } from "../../store/api";
import { Holding } from "../../store/api/schema";
import Orders from "./Orders";
import TradeForm from "./TradeForm";
import { TypedUseQueryStateResult } from "@reduxjs/toolkit/query/react";
import { createSelector } from "@reduxjs/toolkit";
import Chart from "./Chart";

interface InfoProps {
  label: string;
  element: JSX.Element;
}

const Dollars = (value: string) => (
  <NumberFormatter
    prefix="$"
    value={new Decimal(value).toDecimalPlaces(2).toString()}
    thousandSeparator
  />
);

function Info({ label, element }: InfoProps) {
  return (
    <Group justify="space-between">
      <Text>{label}</Text>
      <Text fw="bold">{element}</Text>
    </Group>
  );
}

type GetHoldingSelectFromResultArg = TypedUseQueryStateResult<
  Holding[],
  any,
  any
>;

const selectHoldingForCoin = createSelector(
  (res: GetHoldingSelectFromResultArg) => res.data,
  (_: GetHoldingSelectFromResultArg, coinId?: number) => coinId,
  (holdings, coinId) => holdings?.find((holding) => holding.coinId === coinId),
);

function Trade() {
  const [coinId, setCoinId] = useState<number>();

  const { data: coin } = useGetCoinQuery(coinId!, { skip: !coinId });

  const { holding } = useGetMyHoldingsQuery(undefined, {
    selectFromResult: (result) => ({
      holding: selectHoldingForCoin(result, coinId),
    }),
  });

  return (
    <div>
      <CoinSelector onCoinSelect={(id) => setCoinId(+id)} />
      {coin && (
        <Container pt={50}>
          <Title order={2}>
            {coin.displayName} ({coin.name})
          </Title>
          <Title>{Dollars(coin.currentPrice)}</Title>
          <Divider m={10} />
          <Group justify="space-between" align="flex-start" grow>
            <Stack>
              <Chart coinId={coinId} />
              <Info
                label="Previous Close"
                element={Dollars(coin.previousClose)}
              />
              <Info label="Open" element={Dollars(coin.previousClose)} />
              <Info
                label="Range"
                element={
                  <>
                    {Dollars(coin.dayLow)} - {Dollars(coin.dayHigh)}
                  </>
                }
              />
            </Stack>
            <Stack>
              <TradeForm coinId={coinId} />
              <Title order={4}>Holdings</Title>
              {holding && <Text>{holding.shares}</Text>}
              <Divider m={10} />
              <Title order={4}>Active Orders</Title>
              <Orders coinId={coinId} />
            </Stack>
          </Group>
          <Divider m={10} />
          <Text>{coin.description}</Text>
        </Container>
      )}
    </div>
  );
}

export default Trade;
