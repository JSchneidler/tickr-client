export enum WebSocketMessageType {
  ORDER_FILLED = "ORDER_FILLED",
  WATCH = "WATCH",
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

export interface OrderFilledMessage {
  type: WebSocketMessageType.ORDER_FILLED;
  payload: {
    id: number;
  };
}

export interface PriceUpdate {
  coinId: number;
  high: string;
  low: string;
}

export interface WatchMessage {
  type: WebSocketMessageType.WATCH;
  payload: PriceUpdate;
}

type MessageListener = (payload: any) => void;

export class WebSocketClient {
  private socket: WebSocket = new WebSocket("ws://localhost:3000/api/ws");

  connect() {
    if (!this.socket.CLOSED) return;

    this.socket = new WebSocket("ws://localhost:3000/api/ws");
    this.socket.onopen = () => {
      console.log("Connected to WebSocket");
    };
  }

  disconnect() {
    this.socket.close();
  }

  listen(type: WebSocketMessageType, listener: MessageListener) {
    if (!this.socket.OPEN) throw Error("Not connected to WebSocket");

    const internalListener = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as WebSocketMessage;

      if (message.type === type) listener(message.payload);
    };

    this.socket.addEventListener("message", internalListener);
    return () => this.socket.removeEventListener("message", internalListener);
  }
}
