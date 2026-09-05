import { describe, expect, it } from "vitest";

import type { ProviderAuthorization, ProviderPort } from "./operation.types.js";
import { OperationService } from "./operation.service.js";

class SuccessfulProvider implements ProviderPort {
  async authorize(operationId: string): Promise<ProviderAuthorization> {
    return { operationId, authorized: true, bulbState: "on" };
  }
}

describe("OperationService", () => {
  it("turns a matching provider authorization into the shared bulb event", async () => {
    const service = new OperationService(new SuccessfulProvider());

    await expect(service.run("op-123")).resolves.toEqual({
      operationId: "op-123",
      state: "on",
      source: "mock-provider",
    });
  });

  it("rejects a provider response for a different operation", async () => {
    const provider: ProviderPort = {
      authorize: async () => ({
        operationId: "op-other",
        authorized: true,
        bulbState: "on",
      }),
    };
    const service = new OperationService(provider);

    await expect(service.run("op-123")).rejects.toThrow(
      "Provider returned a mismatched operationId",
    );
  });
});
