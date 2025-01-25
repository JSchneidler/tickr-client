import { Middleware } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import webSocketClient, { WebSocketMessageType } from "../webSocketClient";
import { LivePrice, Order } from "./api/schema";
import { api } from "./api";
import { pricesUpdated } from "./livePrices";

export const webSocketMiddleware: Middleware<{}, any> = (store) => {
  webSocketClient.listen(WebSocketMessageType.WATCH, (prices: LivePrice[]) => {
    store.dispatch(pricesUpdated(prices));
  });

  webSocketClient.listen(WebSocketMessageType.ORDER_FILLED, (order: Order) => {
    notifications.show({
      title: "Order filled",
      message: `Filled order ${order.id} for ${order.totalPrice}`,
    });

    store.dispatch(api.util.invalidateTags(["User", "Holding", "Order"]));
  });

  return (next) => (action) => next(action);
};
