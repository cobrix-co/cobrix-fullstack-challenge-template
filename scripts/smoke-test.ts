import { fileURLToPath } from "node:url";

import { io, type Socket } from "socket.io-client";

interface AcceptedOperation {
  operationId: string;
  accepted: true;
}

interface BulbEvent {
  operationId: string;
  state: "on" | "off";
  source: "mock-provider";
}

interface EventSocket {
  once(event: string, listener: (event: BulbEvent) => void): unknown;
  off(event: string, listener: (event: BulbEvent) => void): unknown;
}

type Fetcher = (input: string, init: RequestInit) => Promise<Response>;

export function correlateOperation(
  operation: AcceptedOperation,
  event: BulbEvent,
): BulbEvent {
  if (operation.operationId !== event.operationId) {
    throw new Error("Operation IDs do not match");
  }
  if (event.state !== "on") {
    throw new Error("Expected the bulb to be on");
  }
  return event;
}

async function waitForHealth(apiUrl: string): Promise<void> {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${apiUrl}/health`);
      if (response.ok) return;
    } catch {
      // The service may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("API did not become healthy within 20 seconds");
}

function waitForConnection(socket: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("WebSocket did not connect within 5 seconds")),
      5_000,
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

export function runOperationAndAwaitEvent(
  apiUrl: string,
  socket: EventSocket,
  request: Fetcher = fetch,
): Promise<{ operation: AcceptedOperation; event: BulbEvent }> {
  return new Promise((resolve, reject) => {
    let operation: AcceptedOperation | undefined;
    let event: BulbEvent | undefined;
    const timeout = setTimeout(
      () => fail(new Error("bulb:state was not delivered within 5 seconds")),
      5_000,
    );

    const onEvent = (received: BulbEvent) => {
      event = received;
      finishIfComplete();
    };

    function cleanup() {
      clearTimeout(timeout);
      socket.off("bulb:state", onEvent);
    }

    function fail(error: unknown) {
      cleanup();
      reject(error);
    }

    function finishIfComplete() {
      if (!operation || !event) return;
      try {
        const correlated = correlateOperation(operation, event);
        cleanup();
        resolve({ operation, event: correlated });
      } catch (error) {
        fail(error);
      }
    }

    socket.once("bulb:state", onEvent);
    void request(`${apiUrl}/operations`, { method: "POST" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Operation request failed with ${response.status}`);
        }
        operation = (await response.json()) as AcceptedOperation;
        finishIfComplete();
      })
      .catch(fail);
  });
}

async function main(): Promise<void> {
  const apiUrl = process.env.API_URL ?? "http://localhost:4000";
  await waitForHealth(apiUrl);

  const socket = io(`${apiUrl}/bulb`, { transports: ["websocket"] });
  try {
    await waitForConnection(socket);
    const result = await runOperationAndAwaitEvent(apiUrl, socket);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } finally {
    socket.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
