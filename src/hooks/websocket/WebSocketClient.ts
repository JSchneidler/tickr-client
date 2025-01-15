export interface WebSocketMessage {
  type: "prices" | undefined;
}

export interface WebSocketClientConfig {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (data: WebSocketMessage) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly config: WebSocketClientConfig;

  constructor(config: WebSocketClientConfig) {
    this.config = config;
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventListeners();
    } catch (error) {
      console.error(`Failed to create WebSocket connection: ${error}`);
      this.config.onError?.(error as Event);
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.config.onOpen?.();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        this.config.onMessage?.(data);
      } catch (error) {
        console.error(`Error parsing message: ${error}`);
      }
    };

    this.ws.onclose = () => {
      this.config.onClose?.();
    };

    this.ws.onerror = (error: Event) => {
      console.error("WebSocket error:");
      console.error(error);
      this.config.onError?.(error);
    };
  }

  sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
