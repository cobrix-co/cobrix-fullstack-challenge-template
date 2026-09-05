export interface ProviderAuthorization {
  operationId: string;
  authorized: boolean;
  bulbState: "on" | "off";
}

export interface ProviderPort {
  authorize(operationId: string): Promise<ProviderAuthorization>;
}

export const PROVIDER_PORT = Symbol("PROVIDER_PORT");
