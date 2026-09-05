import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { Server } from "socket.io";

import { BULB_STATE_EVENT, type BulbStateEvent } from "@cobrix/contracts";

@WebSocketGateway({
  namespace: "/bulb",
  cors: { origin: process.env.WEB_ORIGIN ?? "http://localhost:4173" },
})
export class BulbGateway {
  @WebSocketServer()
  private server!: Server;

  publish(event: BulbStateEvent): void {
    this.server.emit(BULB_STATE_EVENT, event);
  }
}
