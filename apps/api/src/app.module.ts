import { Module } from "@nestjs/common";

import { BulbGateway } from "./bulb.gateway.js";
import { HealthController } from "./health.controller.js";
import { OperationController } from "./operation.controller.js";
import { OperationService } from "./operation.service.js";
import { PROVIDER_PORT } from "./operation.types.js";
import { ProviderClient } from "./provider.client.js";

@Module({
  controllers: [HealthController, OperationController],
  providers: [
    BulbGateway,
    OperationService,
    ProviderClient,
    { provide: PROVIDER_PORT, useExisting: ProviderClient },
  ],
})
export class AppModule {}
