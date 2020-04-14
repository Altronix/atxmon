import { createRouter } from "./controllers/decorators";
import express from "express";
import { Container } from "inversify";

export interface BootArgs {
  container: Container;
  controllers: { new (...args: any[]): {} }[];
  middleware?: { new (...args: any[]): {} }[];
}

export interface Boot {
  controllers: any[];
  // middleware: any[];
  app: express.Application;
}

export function boot(args: BootArgs): Boot {
  let middlewares: any[] = [];
  let controllers = args.controllers.map(c => args.container.get(c));
  let app: express.Application = express();
  controllers.forEach(c => app.use(createRouter(c)));
  return { controllers, app };
}
