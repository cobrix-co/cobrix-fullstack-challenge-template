import { Controller, Inject, Post } from "@nestjs/common";

import { BulbGateway } from "./bulb.gateway.js";
import { OperationService } from "./operation.service.js";

@Controller("operations")
export class OperationController {
  constructor(
    @Inject(OperationService) private readonly operations: OperationService,
    @Inject(BulbGateway) private readonly bulbGateway: BulbGateway,
  ) {}

  @Post()
  async run() {
    const event = await this.operations.run();
    this.bulbGateway.publish(event);

    return { operationId: event.operationId, accepted: true as const };
  }
}
