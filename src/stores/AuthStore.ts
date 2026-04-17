import { makeAutoObservable, runInAction } from 'mobx';
import * as SecureStore from 'expo-secure-store';

import { generateUuidV4, isValidUuid } from '../utils/uuid';

const TOKEN_KEY = 'mecenate.user_token';

export class AuthStore {
  token: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this);
  }

  async hydrate(): Promise<void> {
    let stored: string | null = null;
    try {
      stored = await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      // SecureStore not available (e.g. web) — fall through, generate fresh.
    }

    let token = stored && isValidUuid(stored) ? stored : null;
    if (!token) {
      token = generateUuidV4();
      try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      } catch {
        // ignore
      }
    }

    runInAction(() => {
      this.token = token;
      this.isReady = true;
    });
  }

  getToken = (): string | null => this.token;
}
