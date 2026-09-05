import Fastify, { type FastifyInstance } from "fastify";

interface AuthorizationBody {
  operationId?: unknown;
}

export function buildMockProvider(): FastifyInstance {
  const app = Fastify({ logger: process.env.NODE_ENV !== "test" });

  app.get("/health", async () => ({ status: "ok" as const }));

  app.post<{ Body: AuthorizationBody }>(
    "/authorize",
    async (request, reply) => {
      const operationId = request.body?.operationId;

      if (typeof operationId !== "string" || operationId.trim().length === 0) {
        return reply.status(400).send({
          code: "INVALID_OPERATION_ID",
          message: "operationId must be a non-empty string",
        });
      }

      return {
        operationId,
        authorized: true as const,
        bulbState: "on" as const,
      };
    },
  );

  return app;
}
