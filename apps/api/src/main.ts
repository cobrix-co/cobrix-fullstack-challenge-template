import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

const port = Number(process.env.PORT ?? 4000);
const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:4173";

const app = await NestFactory.create(AppModule);
app.enableCors({ origin: webOrigin });
await app.listen(port, "0.0.0.0");
