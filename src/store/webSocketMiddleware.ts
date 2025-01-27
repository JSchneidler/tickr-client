import { Middleware, isAnyOf } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { WebSocketClient, WebSocketMessageType } from "../webSocketClient";
import { LivePrice, Order } from "./api/schema";
import { api } from "./api";
import { pricesUpdated } from "./livePrices";
import { RootState } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const webSocketMiddleware: Middleware<{}, RootState> = (store) => {
  const webSocketClient = new WebSocketClient();

  function attachListeners() {
    webSocketClient.listen(
      WebSocketMessageType.WATCH,
      (prices: LivePrice[]) => {
        store.dispatch(pricesUpdated(prices));
      },
    );

    webSocketClient.listen(
      WebSocketMessageType.ORDER_FILLED,
      (order: Order) => {
        const { data: coin } = api.endpoints.getCoin.select(order.coinId)(
          store.getState(),
        );
        const quantity = order.shares
          ? `${order.shares} shares`
          : `$${order.price}`;
        notifications.show({
          title: "Order filled",
          message: `${order.direction}@${order.type} ${quantity} of ${coin.name}`,
        });

        store.dispatch(api.util.invalidateTags(["User", "Holding", "Order"]));
      },
    );
  }

  attachListeners();

  return (next) => (action) => {
    if (
      isAnyOf(
        api.endpoints.register.matchFulfilled,
        api.endpoints.login.matchFulfilled,
        api.endpoints.logout.matchFulfilled,
      )(action)
    ) {
      webSocketClient.disconnect();
      webSocketClient.connect();
      attachListeners();
    }

    return next(action);
  };
};
