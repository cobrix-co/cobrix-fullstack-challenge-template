import { describe, expect, it } from "vitest";

import { correlateOperation, runOperationAndAwaitEvent } from "./smoke-test.js";

describe("smoke correlation", () => {
  it("returns the event when HTTP and WebSocket operation IDs match", () => {
    expect(
      correlateOperation(
        { operationId: "op-123", accepted: true },
        { operationId: "op-123", state: "on", source: "mock-provider" },
      ),
    ).toEqual({
      operationId: "op-123",
      state: "on",
      source: "mock-provider",
    });
  });

  it("rejects a WebSocket event from a different operation", () => {
    expect(() =>
      correlateOperation(
        { operationId: "op-123", accepted: true },
        { operationId: "op-other", state: "on", source: "mock-provider" },
      ),
    ).toThrow("Operation IDs do not match");
  });

  it("rejects an event that does not turn the bulb on", () => {
    expect(() =>
      correlateOperation(
        { operationId: "op-123", accepted: true },
        { operationId: "op-123", state: "off", source: "mock-provider" },
      ),
    ).toThrow("Expected the bulb to be on");
  });

  it("reports an HTTP failure without waiting for an unrelated event timeout", async () => {
    const socket = {
      once: () => undefined,
      off: () => undefined,
    };

    await expect(
      runOperationAndAwaitEvent(
        "http://api.test",
        socket,
        async () => new Response(null, { status: 500 }),
      ),
    ).rejects.toThrow("Operation request failed with 500");
  });
});
