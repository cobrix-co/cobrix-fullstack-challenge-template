import { useMemo } from "react";

import { createBulbClient, type BulbClient } from "./bulb-client.js";
import { readRuntimeConfig } from "./config.js";
import { useBulbFlow } from "./useBulbFlow.js";

interface AppProps {
  client?: BulbClient;
}

const labels = {
  accepted: "Accepted",
  connected: "Connected",
  connecting: "Connecting",
  disconnected: "Disconnected",
  error: "Error",
  idle: "Idle",
  off: "Off",
  on: "On",
  running: "Running",
} as const;

export function App({ client: providedClient }: AppProps) {
  const client = useMemo(
    () => providedClient ?? createBulbClient(readRuntimeConfig()),
    [providedClient],
  );
  const flow = useBulbFlow(client);

  return (
    <main className="shell">
      <section className="challenge-card">
        <header>
          <span className="eyebrow">COBRIX · FULL-STACK CHALLENGE</span>
          <h1>Make the system talk.</h1>
          <p>
            Repair the environment, complete the request, and deliver the result
            through WebSocket.
          </p>
        </header>

        <div className="workspace">
          <div className="bulb-stage" aria-live="polite">
            <div className={`bulb bulb--${flow.bulb}`} aria-hidden="true">
              <span className="bulb__glass" />
              <span className="bulb__base" />
            </div>
            <span className="bulb-label">{labels[flow.bulb]}</span>
          </div>

          <dl className="status-grid">
            <div>
              <dt>API</dt>
              <dd data-state={flow.request}>{labels[flow.request]}</dd>
            </div>
            <div>
              <dt>WebSocket</dt>
              <dd data-state={flow.connection}>{labels[flow.connection]}</dd>
            </div>
            <div>
              <dt>Operation</dt>
              <dd className="operation-id">{flow.operationId ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <button
          className="run-button"
          type="button"
          disabled={flow.request === "running"}
          onClick={() => void flow.run()}
        >
          {flow.request === "running" ? "Running…" : "Run request"}
        </button>
      </section>
    </main>
  );
}
