import { useState } from "react";
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
import {
  useGetCoinQuery,
  useGetMyHoldingsQuery,
  useMeQuery,
} from "../../store/api";
import Orders from "./Orders";
import TradeForm from "./TradeForm";
import Chart from "./Chart";
import Dollars from "../Dollars";
import Gain from "../Gain";
import { useLivePrice } from "../../hooks/useLivePrice";
import { selectHoldingForCoin } from "../../store/selectors";

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

function Trade() {
  const [coinId, setCoinId] = useState<number>();

  const { data: user } = useMeQuery();
  const { data: coin } = useGetCoinQuery(coinId, { skip: !coinId });
  const { price, change, changePercent } = useLivePrice(coinId);

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
            <Dollars value={price} />
            <Gain change={change} changePercent={changePercent} />
          </Title>
          <Divider m={10} />
          <Group justify="space-between" align="flex-start" grow>
            <Stack>
              {coinId && <Chart coinId={coinId} />}
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
            {user && (
              <Stack>
                <TradeForm coinId={coinId} />
                <Divider m={10} />
                <Center>
                  <Title order={3}>
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
                        ) at cost average of <Dollars value={holding.cost} />
                      </>
                    )}
                  </Title>
                </Center>
                <Divider m={10} />
                <Title order={4}>Active Orders</Title>
                <Orders coinId={coinId} />
              </Stack>
            )}
          </Group>
          <Divider m={10} />
          <Text>{coin.description}</Text>
        </Container>
      )}
    </div>
  );
}

export default Trade;
