import type { AddressInfo } from "node:net";

import { Test } from "@nestjs/testing";
import { io, type Socket } from "socket.io-client";
import { afterEach, describe, expect, it } from "vitest";

import { BULB_STATE_EVENT, type BulbStateEvent } from "@cobrix/contracts";
import { buildMockProvider } from "@cobrix/mock-provider";

import { AppModule } from "./app.module.js";

const cleanup: Array<() => Promise<void> | void> = [];

afterEach(async () => {
  while (cleanup.length > 0) {
    await cleanup.pop()?.();
  }
});

describe("operation integration", () => {
  it("correlates the HTTP operation with the WebSocket bulb event", async () => {
    const provider = buildMockProvider();
    await provider.listen({ host: "127.0.0.1", port: 0 });
    cleanup.push(() => provider.close());
    const providerAddress = provider.server.address() as AddressInfo;
    process.env.PROVIDER_URL = `http://127.0.0.1:${providerAddress.port}`;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = moduleRef.createNestApplication();
    await app.listen(0, "127.0.0.1");
    cleanup.push(() => app.close());

    const apiAddress = app.getHttpServer().address() as AddressInfo;
    const apiUrl = `http://127.0.0.1:${apiAddress.port}`;
    const socket = io(`${apiUrl}/bulb`, { transports: ["websocket"] });
    cleanup.push(() => {
      socket.close();
    });
    await waitForConnection(socket);

    const eventPromise = waitForBulbEvent(socket);
    const response = await fetch(`${apiUrl}/operations`, { method: "POST" });
    const body = (await response.json()) as {
      operationId: string;
      accepted: boolean;
    };
    const event = await eventPromise;

    expect(response.status).toBe(201);
    expect(body).toEqual({ operationId: event.operationId, accepted: true });
    expect(event).toEqual({
      operationId: body.operationId,
      state: "on",
      source: "mock-provider",
    });
  });
});

function waitForConnection(socket: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Timed out connecting to the bulb namespace")),
      1_500,
    );
    socket.once("connect", () => {
      clearTimeout(timeout);
      resolve();
    });
    socket.once("connect_error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

function waitForBulbEvent(socket: Socket): Promise<BulbStateEvent> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Timed out waiting for bulb:state")),
      1_500,
    );
    socket.once(BULB_STATE_EVENT, (event: BulbStateEvent) => {
      clearTimeout(timeout);
      resolve(event);
    });
  });
}
