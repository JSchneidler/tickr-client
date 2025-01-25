import { useEffect } from "react";

import webSocketClient, { WebSocketMessageType } from "../webSocketClient";

export const useWebSocket = (
  messageType: WebSocketMessageType,
  onMessage: (payload: any) => void,
) => {
  useEffect(() => {
    const removeListen = webSocketClient.listen(messageType, onMessage);
    return () => removeListen();
  }, [messageType, onMessage]);
};
