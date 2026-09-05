import { useCallback, useEffect, useState } from "react";

import { isBulbStateEvent, type BulbState } from "@cobrix/contracts";

import type { BulbClient, ConnectionState } from "./bulb-client.js";

export type RequestState = "idle" | "running" | "accepted" | "error";

export function useBulbFlow(client: BulbClient) {
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [request, setRequest] = useState<RequestState>("idle");
  const [bulb, setBulb] = useState<BulbState>("off");
  const [operationId, setOperationId] = useState<string>();

  useEffect(
    () =>
      client.connect((event) => {
        if (isBulbStateEvent(event)) {
          setBulb(event.state);
          setOperationId(event.operationId);
        }
      }, setConnection),
    [client],
  );

  const run = useCallback(async () => {
    setRequest("running");
    setBulb("off");
    setOperationId(undefined);

    try {
      const operation = await client.runOperation();
      setOperationId(operation.operationId);
      setRequest("accepted");
    } catch {
      setRequest("error");
    }
  }, [client]);

  return { bulb, connection, operationId, request, run };
}
