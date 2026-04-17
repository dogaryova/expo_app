import 'react-native-gesture-handler';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { RootStore, RootStoreProvider } from '../src/stores/RootStore';
import { useWsSync } from '../src/hooks/useWsSync';
import { colors } from '../src/theme';

function useAppStateFocus() {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      focusManager.setFocused(state === 'active');
    });
    return () => sub.remove();
  }, []);
}

/**
 * Inner tree rendered after providers are in place — mounts WS → RQ sync.
 */
function AppTree() {
  useWsSync();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}

export default function RootLayout() {
  const rootStore = useMemo(() => new RootStore(), []);
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 30_000,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
        },
        mutations: { retry: 0 },
      },
    });
  }

  const [ready, setReady] = useState(false);

  useAppStateFocus();

  useEffect(() => {
    let cancelled = false;
    rootStore.auth.hydrate().then(() => {
      if (cancelled) return;
      setReady(true);
      rootStore.ws.connect();
    });
    return () => {
      cancelled = true;
      rootStore.ws.close();
    };
  }, [rootStore]);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <RootStoreProvider value={rootStore}>
          <QueryClientProvider client={queryClientRef.current}>
            <StatusBar style="dark" />
            <AppTree />
          </QueryClientProvider>
        </RootStoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
