import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import log from "./common/logger";

import { Controllers } from "./controllers/controllers";
import { Services } from "./services/services";
import { createRouter, getControllerMiddleware } from "./decorators";
import { Container, injectable, inject } from "inversify";

import * as bodyParser from "body-parser";
import express from "express";

log("info", "starting app...");

@injectable()
export class App {
  server: express.Application;
  services: Services;
  middleware: any[] = [];
  constructor(
    @inject(Controllers)
    private controllers: Controllers,
    @inject(Services)
    services: Services
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

    // For each controller, get middleware
    controllers.forEach(controller => {
      let m = getControllerMiddleware(controller).map(m => container.get(m));
      this.server.use(createRouter(controller, ...m));
      this.middleware = this.middleware.concat(m);
    });
  }
}

(async () => {
  let container = await createContainer();
  container.bind<App>(App).toSelf();
  let app = container.get<App>(App);
  app.load(container);
  app.server.use(bodyParser.urlencoded({ extended: true }));
  app.server.use(bodyParser.json());
  app.server.listen(3000);
  let user = await app.services.users.create({
    name: "Thomas",
    pass: "Secret",
    role: 0
  });

  app.services.linq.listen(33455);
  app.services.linq.on("heartbeat", serial => log("info", serial));
  app.services.linq.run(50);
})();
