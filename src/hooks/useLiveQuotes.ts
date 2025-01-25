import { useWebSocket } from "./useWebSocket";
import { PriceUpdate, WebSocketMessageType } from "../webSocketClient";

export const useLiveQuotes = (coins: number[]) => {
  useWebSocket([WebSocketMessageType.WATCH], (payload: PriceUpdate) => {
    if (coins.includes(payload.coinId)) console.log(payload);
  });

  return;
};
