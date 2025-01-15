import { useState, useCallback, useRef, useEffect } from "react";
import { WebSocketClient, WebSocketMessage } from "./WebSocketClient";

interface UseWebSocketOptions {
  url: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  onMessage?: (data: WebSocketMessage) => void;
}

export const useWebSocket = ({
  url,
  reconnectAttempts = 5,
  reconnectDelay = 3000,
  onMessage,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<WebSocketClient | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<number>();

  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (clientRef.current) clientRef.current.disconnect();

    clientRef.current = new WebSocketClient({
      url,
      onOpen: () => {
        console.log("Connected to WebSocket");
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
      },
      onClose: () => {
        console.log("WebSocket closed");
        setIsConnected(false);
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          reconnectTimeoutRef.current = window.setTimeout(
            connect,
            reconnectDelay,
          );
        } else setError("Reached max reconnection attempts");
      },
      onError: () => {
        setError("WebSocket error occurred");
      },
      onMessage: (data) => onMessageRef.current?.(data),
    });

    clientRef.current.connect();
  }, [url, reconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }

    setIsConnected(false);
    setError(null);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    try {
      clientRef.current?.sendMessage(message);
    } catch (error) {
      setError((error as Error).message);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    sendMessage,
  };
};
