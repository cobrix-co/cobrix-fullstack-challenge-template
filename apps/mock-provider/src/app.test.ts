import { afterEach, describe, expect, it } from "vitest";

import { buildMockProvider } from "./app.js";

const apps: Array<ReturnType<typeof buildMockProvider>> = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe("mock provider authorization", () => {
  it("authorizes a valid operation with a deterministic bulb state", async () => {
    const app = buildMockProvider();
    apps.push(app);

    const response = await app.inject({
      method: "POST",
      url: "/authorize",
      payload: { operationId: "op-123" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      operationId: "op-123",
      authorized: true,
      bulbState: "on",
    });
  });

  it("rejects a blank operation identifier", async () => {
    const app = buildMockProvider();
    apps.push(app);

    const response = await app.inject({
      method: "POST",
      url: "/authorize",
      payload: { operationId: "" },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      code: "INVALID_OPERATION_ID",
      message: "operationId must be a non-empty string",
    });
  });
});
