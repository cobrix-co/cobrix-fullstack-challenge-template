export const BULB_STATE_EVENT = "bulb:state" as const;

export type BulbState = "on" | "off";

export interface BulbStateEvent {
  operationId: string;
  state: BulbState;
  source: "mock-provider";
}

export function isBulbStateEvent(value: unknown): value is BulbStateEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const event = value as Record<string, unknown>;

  return (
    typeof event.operationId === "string" &&
    event.operationId.length > 0 &&
    (event.state === "on" || event.state === "off") &&
    event.source === "mock-provider"
  );
}
