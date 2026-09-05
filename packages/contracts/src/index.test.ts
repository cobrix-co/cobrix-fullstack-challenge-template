import { describe, expect, it } from "vitest";

import { BULB_STATE_EVENT, isBulbStateEvent } from "./index.js";

describe("bulb event contract", () => {
  it("accepts the complete provider event and rejects an invalid state", () => {
    expect(BULB_STATE_EVENT).toBe("bulb:state");
    expect(
      isBulbStateEvent({
        operationId: "op-1",
        state: "on",
        source: "mock-provider",
      }),
    ).toBe(true);
    expect(
      isBulbStateEvent({
        operationId: "op-1",
        state: "enabled",
        source: "mock-provider",
      }),
    ).toBe(false);
  });
});
