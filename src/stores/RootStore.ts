import { createContext, useContext } from 'react';
import { AuthStore } from './AuthStore';
import { WsStore } from './WsStore';
import { configureAuth } from '../api/client';

export class RootStore {
  readonly auth: AuthStore;
  readonly ws: WsStore;

  constructor() {
    this.auth = new AuthStore();
    this.ws = new WsStore(() => this.auth.token);
    configureAuth(() => this.auth.token);
  }
}

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

export function useRootStore(): RootStore {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useRootStore must be used inside RootStoreProvider');
  }
  return store;
}

export function useAuthStore(): AuthStore {
  return useRootStore().auth;
}

export function useWsStore(): WsStore {
  return useRootStore().ws;
}
