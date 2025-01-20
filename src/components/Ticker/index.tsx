// import { useEffect } from "react";
import { Divider, Group, ScrollArea, Stack, Text } from "@mantine/core";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectPrices,
  selectStatus,
  setPrices,
  setStatus,
  Price,
  Prices,
} from "./slice";
import { useWebSocket } from "../../hooks/websocket/useWebSocket";
import {
  // WebSocketClient,
  WebSocketMessage,
} from "../../hooks/websocket/WebSocketClient";

import "./Ticker.css";

interface PricesMessage extends WebSocketMessage {
  type: "prices";
  prices: Prices;
}

function Coin(price: Price) {
  let color = "white";
  if (price.change < 0) color = "red";
  else if (price.change > 0) color = "green";

  return (
    <Stack h="100%" miw={100} gap={0} px={10} py={5} justify="space-between">
      <Group justify="space-between" wrap="nowrap" className="line-height-1">
        <Text c="white">{price.coin}</Text>
        <Text c="white" fw={700}>
          {price.price.toFixed(2)}
        </Text>
      </Group>
      <Group gap={5} align="flex-end" wrap="nowrap" className="line-height-1">
        <Text c={color} size="xl">
          {price.change_percent.toFixed(2)}%
        </Text>
        <Text c={color} size="s">
          ({price.change.toFixed(2)})
        </Text>
      </Group>
    </Stack>
  );
}

function Ticker() {
  const dispatch = useAppDispatch();
  const prices = useAppSelector(selectPrices);
  const status = useAppSelector(selectStatus);

  // useEffect(() => {
  //   const ws = new WebSocketClient({
  //     url: "ws://localhost:3000/ws",
  //     onMessage: (message) => {
  //       if (message.type !== "prices") return;

  //       try {
  //         const latestPrices = (message as PricesMessage).prices;
  //         const newPrices: Price[] = [];
  //         for (const key in latestPrices) newPrices.push(latestPrices[key]);

  //         dispatch(setPrices(newPrices));
  //         dispatch(setStatus("idle"));
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     },
  //   });

  //   ws.connect();
  // }, [dispatch]);

  useWebSocket({
    url: "ws://localhost:3000/ws",
    onMessage: (message) => {
      if (message.type !== "prices") return;

      try {
        const latestPrices = (message as PricesMessage).prices;
        const newPrices: Price[] = [];
        for (const key in latestPrices) newPrices.push(latestPrices[key]);

        dispatch(setPrices(newPrices));
        dispatch(setStatus("idle"));
      } catch (err) {
        console.error(err);
      }
    },
  });

  const alpha = status === "idle" ? "0.9" : "0.3";

  return (
    <ScrollArea id="ticker" h="100%" type="never">
      <Group
        align="stretch"
        bg={`rgba(0, 0, 0, ${alpha})`}
        wrap="nowrap"
        gap={0}
        h="100%"
        className="divide-x divide-gray-700"
      >
        {prices.map((price, i) => (
          <div key={price.coin}>
            {Coin(price)}
            {i < prices.length - 1 && (
              <Divider size="xs" orientation="vertical" />
            )}
          </div>
        ))}
      </Group>
    </ScrollArea>
  );
}

export default Ticker;
