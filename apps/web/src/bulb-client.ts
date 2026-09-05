import { io } from "socket.io-client";

import type { RuntimeConfig } from "./config.js";

export type ConnectionState = "connecting" | "connected" | "disconnected";

export interface AcceptedOperation {
  operationId: string;
  accepted: true;
}

export interface BulbClient {
  connect(
    onEvent: (event: unknown) => void,
    onConnection: (state: ConnectionState) => void,
  ): () => void;
  runOperation(): Promise<AcceptedOperation>;
}

export function createBulbClient(config: RuntimeConfig): BulbClient {
  return {
    connect(onEvent, onConnection) {
      onConnection("connecting");
      const socket = io(config.socketUrl, {
        transports: ["websocket"],
      });
      socket.on("connect", () => onConnection("connected"));
      socket.on("disconnect", () => onConnection("disconnected"));
      socket.on("bulb:updated", onEvent);

      return () => {
        socket.close();
      };
    },

    async runOperation() {
      const response = await fetch(`${config.apiUrl}/operations`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Operation failed with ${response.status}`);
      }

      const payload = (await response.json()) as Partial<AcceptedOperation>;
      if (
        typeof payload.operationId !== "string" ||
        payload.accepted !== true
      ) {
        throw new Error("API returned an invalid operation response");
      }

      return payload as AcceptedOperation;
    },
  };
}
