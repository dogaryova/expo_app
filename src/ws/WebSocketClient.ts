
import type { WsEvent } from '../api/types';

type Listener = (evt: WsEvent) => void;
type StatusListener = (connected: boolean) => void;

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 15000;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private tokenProvider: () => string | null;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = false;

  constructor(url: string, tokenProvider: () => string | null) {
    this.url = url;
    this.tokenProvider = tokenProvider;
  }

  connect(): void {
    const token = this.tokenProvider();
    if (!token) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.shouldReconnect = true;

    const fullUrl = `${this.url}?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(fullUrl);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.notifyStatus(true);
    };

    ws.onmessage = (ev: MessageEvent<string>) => {
      try {
        const data = JSON.parse(ev.data) as WsEvent;
        if (!data || typeof data !== 'object' || !('type' in data)) return;
        this.listeners.forEach((l) => {
          try {
            l(data);
          } catch {
            /* swallow per-listener errors */
          }
        });
      } catch {
        /* ignore malformed payloads */
      }
    };

    ws.onerror = () => {
      // Noisy logs; reconnect is handled on close.
    };

    ws.onclose = () => {
      this.notifyStatus(false);
      this.ws = null;
      if (!this.shouldReconnect) return;
      this.scheduleReconnect();
    };
  }

  close(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        /* ignore */
      }
      this.ws = null;
    }
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  subscribeStatus(fn: StatusListener): () => void {
    this.statusListeners.add(fn);
    return () => this.statusListeners.delete(fn);
  }

  private scheduleReconnect(): void {
    const delay = Math.min(
      RECONNECT_MAX_MS,
      RECONNECT_BASE_MS * 2 ** this.reconnectAttempts,
    );
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private notifyStatus(connected: boolean): void {
    this.statusListeners.forEach((l) => {
      try {
        l(connected);
      } catch {
        /* ignore */
      }
    });
  }
}
