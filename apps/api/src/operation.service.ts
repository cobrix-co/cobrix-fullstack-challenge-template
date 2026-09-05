import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import type { BulbStateEvent } from "@cobrix/contracts";

import { PROVIDER_PORT, type ProviderPort } from "./operation.types.js";

@Injectable()
export class OperationService {
  constructor(@Inject(PROVIDER_PORT) private readonly provider: ProviderPort) {}

  async run(operationId: string = randomUUID()): Promise<BulbStateEvent> {
    const authorization = await this.provider.authorize(operationId);

    if (authorization.operationId !== operationId) {
      throw new Error("Provider returned a mismatched operationId");
    }

    return {
      operationId,
      state: authorization.bulbState,
      source: "mock-provider",
    };
  }
}
