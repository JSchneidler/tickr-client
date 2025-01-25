import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { TypedUseQueryStateResult } from "@reduxjs/toolkit/query/react";
import {
  Title,
  // Loader,
  Container,
  Text,
  Divider,
  Stack,
  Group,
  Center,
} from "@mantine/core";
import Decimal from "decimal.js";

import CoinSelector from "../CoinSelector";
import { useGetCoinQuery, useGetMyHoldingsQuery } from "../../store/api";
import { Holding } from "../../store/api/schema";
import Orders from "./Orders";
import TradeForm from "./TradeForm";
import Chart from "./Chart";
import Dollars from "../Dollars";
import Gain from "../Gain";
import { useAppSelector } from "../../store/hooks";
import { selectById } from "../../store/livePrices";

interface InfoProps {
  label: string;
  element: JSX.Element;
}

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

export const selectHoldingForCoin = createSelector(
  (res: GetHoldingSelectFromResultArg) => res.data,
  (_: GetHoldingSelectFromResultArg, coinId?: number) => coinId,
  (holdings, coinId) => holdings?.find((holding) => holding.coinId === coinId),
);

function Trade() {
  const [coinId, setCoinId] = useState<number>();

  const { data: coin } = useGetCoinQuery(coinId, { skip: !coinId });
  const livePrice = useAppSelector((state) => selectById(state, coinId));

  const { holding } = useGetMyHoldingsQuery(undefined, {
    selectFromResult: (result) => ({
      holding: selectHoldingForCoin(result, coinId),
    }),
  });

  return (
    <div>
      <CoinSelector onCoinSelect={(id) => setCoinId(+id)} />
      {coin && (
        <Container size="xl" pt={50}>
          <Title order={2}>
            {coin.displayName} ({coin.name})
          </Title>
          <Title>
            <Dollars
              value={
                livePrice && livePrice.price
                  ? livePrice.price
                  : coin.currentPrice
              }
            />
            <Gain change={coin.change} changePercent={coin.changePercent} />
          </Title>
          <Divider m={10} />
          <Group justify="space-between" align="flex-start" grow>
            <Stack>
              <Chart coinId={coinId} />
              <Info
                label="Previous Close"
                element={<Dollars value={coin.previousClose} />}
              />
              <Info
                label="Open"
                element={<Dollars value={coin.previousClose} />}
              />
              <Info
                label="Range"
                element={
                  <>
                    {<Dollars value={coin.dayLow} />} -{" "}
                    {<Dollars value={coin.dayHigh} />}
                  </>
                }
              />
            </Stack>
            <Stack>
              <TradeForm coinId={coinId} />
              <Divider m={10} />
              <Center>
                <Title>
                  {!holding && "No owned shares"}
                  {holding && (
                    <>
                      {holding.shares} shares (
                      <Dollars
                        value={new Decimal(holding.shares)
                          .mul(coin.currentPrice)
                          .toDecimalPlaces(2)
                          .toString()}
                      />
                      )
                    </>
                  )}
                </Title>
              </Center>
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
