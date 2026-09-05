import { Injectable } from "@nestjs/common";

import type { ProviderAuthorization, ProviderPort } from "./operation.types.js";

@Injectable()
export class ProviderClient implements ProviderPort {
  constructor(
    private readonly baseUrl = process.env.PROVIDER_URL ??
      "http://mock-provider:4100",
  ) {}

  async authorize(operationId: string): Promise<ProviderAuthorization> {
    const response = await fetch(`${this.baseUrl}/authorize`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ operationId }),
    });

    if (!response.ok) {
      throw new Error(`Provider authorization failed with ${response.status}`);
    }

    const payload = (await response.json()) as Partial<ProviderAuthorization>;
    if (
      typeof payload.operationId !== "string" ||
      payload.authorized !== true ||
      (payload.bulbState !== "on" && payload.bulbState !== "off")
    ) {
      throw new Error("Provider returned an invalid authorization response");
    }

    return payload as ProviderAuthorization;
  }
}
