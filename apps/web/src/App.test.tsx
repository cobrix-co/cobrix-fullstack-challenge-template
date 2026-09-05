import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { BulbStateEvent } from "@cobrix/contracts";

import { App } from "./App.js";
import type { BulbClient, ConnectionState } from "./bulb-client.js";

class TestBulbClient implements BulbClient {
  private eventListener?: (event: BulbStateEvent) => void;

  connect(
    onEvent: (event: unknown) => void,
    onConnection: (state: ConnectionState) => void,
  ) {
    this.eventListener = onEvent;
    onConnection("connected");
    return () => undefined;
  }

  async runOperation() {
    return { operationId: "op-123", accepted: true as const };
  }

  turnOn() {
    this.eventListener?.({
      operationId: "op-123",
      state: "on",
      source: "mock-provider",
    });
  }
}

describe("App", () => {
  it("keeps the bulb off after HTTP acceptance until the WebSocket event arrives", async () => {
    const client = new TestBulbClient();
    const user = userEvent.setup();
    render(<App client={client} />);

    expect(screen.getByText("Off")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Run request" }));

    expect(await screen.findByText("Accepted")).toBeInTheDocument();
    expect(screen.getByText("Off")).toBeInTheDocument();

    client.turnOn();

    expect(await screen.findByText("On")).toBeInTheDocument();
  });

  it("ignores malformed WebSocket payloads", async () => {
    const client: BulbClient = {
      connect: (onEvent, onConnection) => {
        onConnection("connected");
        onEvent({ operationId: "op-123", state: "enabled" });
        return () => undefined;
      },
      runOperation: async () => ({ operationId: "op-123", accepted: true }),
    };

    render(<App client={client} />);

    expect(screen.getByText("Off")).toBeInTheDocument();
  });
});
