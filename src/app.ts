import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import log from "./common/logger";

import { Controllers } from "./controllers/controllers";
import { Services } from "./services/services";
import { createRouter, getControllerMiddleware } from "./common/decorators";
import { Container, injectable, inject } from "inversify";

import * as bodyParser from "body-parser";
import express from "express";

@injectable()
export class App {
  server: express.Application;
  services: Services;
  middleware: any[] = [];
  constructor(
    @inject(Controllers) private controllers: Controllers,
    @inject(Services) services: Services
  ) {
    this.server = express();
    this.services = services;
  }

  load(container: Container) {
    let controllers = [
      this.controllers.user,
      this.controllers.device,
      this.controllers.root
    ];

    controllers.forEach(controller =>
      this.server.use(createRouter(container, controller))
    );
  }
}

export default async () => {
  let container = await createContainer();
  let app = container.get<App>(App);
  app.load(container);
  return app;
};
