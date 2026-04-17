
import Constants from 'expo-constants';
import type { ApiResponse } from './types';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  'https://k8s.mectest.ru/test-app';

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

type TokenProvider = () => string | null;

let tokenProvider: TokenProvider = () => null;

export function configureAuth(provider: TokenProvider) {
  tokenProvider = provider;
}

export function getApiUrl(): string {
  return API_URL;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
}

function buildQuery(query?: RequestOptions['query']): string {
  if (!query) return '';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
}

export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const token = tokenProvider();
  const url = `${API_URL}${path}${buildQuery(opts.query)}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: opts.signal,
    });
  } catch (err) {
    throw new ApiError('NETWORK_ERROR', (err as Error).message || 'Network error', 0);
  }

  let json: ApiResponse<T> | undefined;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('PARSE_ERROR', `Failed to parse response from ${path}`, res.status);
  }

  if (!json.ok) {
    throw new ApiError(json.error.code, json.error.message, res.status);
  }
  return json.data;
}
