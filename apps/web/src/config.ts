export interface RuntimeConfig {
  apiUrl: string;
  socketUrl: string;
}

export function readRuntimeConfig(): RuntimeConfig {
  return {
    apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:4000",
    socketUrl: import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000",
  };
}
