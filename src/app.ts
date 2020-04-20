import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import log from "./common/logger";

import { DatabaseService, LinqNetworkService } from "./ioc/types";
import { DeviceController } from "./device/device.controller";
import { DeviceModel } from "./device/device.model";
import { UserController } from "./user/user.controller";
import { UserModel, UserEntry } from "./user/user.model";
import { createRouter, getControllerMiddleware } from "./common/decorators";
import { Container, injectable, inject } from "inversify";

import * as bodyParser from "body-parser";
import express from "express";

@injectable()
export class App {
  container!: Container;
  linq: LinqNetworkService;
  devices: DatabaseService<DeviceModel>;
  users: DatabaseService<UserModel, UserEntry>;
  server: express.Application;
  constructor(
    @inject(SYMBOLS.DATABASE_USER) users: DatabaseService<UserModel, UserEntry>,
    @inject(SYMBOLS.DATABASE_DEVICE) devices: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE) linq: LinqNetworkService,
    @inject(UserController) private user: UserController,
    @inject(DeviceController) private device: DeviceController
  ) {
    this.linq = linq;
    this.users = users;
    this.devices = devices;
    this.server = express();
  }

  use(...args: any[]): App {
    this.server.use(...args);
    return this;
  }

  load(): App {
    let controllers = [this.user, this.device];

    controllers.forEach(controller =>
      this.server.use(createRouter(this.container, controller))
    );
    return this;
  }
}

export default async () => {
  let container = await createContainer();
  let app = container.get<App>(App);
  app.container = container;
  app.load();
  return app;
};
