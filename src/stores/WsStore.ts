import { makeAutoObservable, runInAction } from 'mobx';
import Constants from 'expo-constants';

import { WebSocketClient } from '../ws/WebSocketClient';
import type { WsEvent } from '../api/types';

const WS_URL =
  (Constants.expoConfig?.extra?.wsUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_WS_URL ??
  'wss://k8s.mectest.ru/test-app/ws';

export class WsStore {
  isConnected = false;
  private client: WebSocketClient;
  private unsubscribeStatus: (() => void) | null = null;

  constructor(tokenProvider: () => string | null) {
    makeAutoObservable(this, { subscribe: false });
    this.client = new WebSocketClient(WS_URL, tokenProvider);
    this.unsubscribeStatus = this.client.subscribeStatus((connected) => {
      runInAction(() => {
        this.isConnected = connected;
      });
    });
  }

  connect = (): void => {
    this.client.connect();
  };

  close = (): void => {
    this.client.close();
    this.unsubscribeStatus?.();
    this.unsubscribeStatus = null;
  };

  subscribe(fn: (event: WsEvent) => void): () => void {
    return this.client.subscribe(fn);
  }
}
