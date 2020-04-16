import { getControllerMiddleware, createRouter } from "./decorators";
import express from "express";
import { Container } from "inversify";

export interface BootArgs {
  container: Container;
  controllers: { new (...args: any[]): {} }[];
}

export interface Boot {
  controllers: any[];
  middleware: any[];
  app: express.Application;
}

export function boot(args: BootArgs): Boot {
  let middleware: any[] = [];

  // Create app
  let app: express.Application = express();
  let controllers = args.controllers.map(c => args.container.get(c));
  controllers.forEach(c => {
    let m = getControllerMiddleware(c).map(m => args.container.get(m));
    app.use(createRouter(c, ...m));
    middleware = middleware.concat(m);
  });

  return { controllers, middleware, app };
}
