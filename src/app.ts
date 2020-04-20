import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import log from "./common/logger";

import { DatabaseService, LinqNetworkService } from "./types";
import { DeviceController } from "./device/device.controller";
import { DeviceModel } from "./device/device.model";
import { UserController } from "./user/user.controller";
import { UserModel, UserEntry } from "./user/user.model";
import { createRouter, getControllerMiddleware } from "./common/decorators";
import { Container, injectable, inject } from "inversify";

import * as bodyParser from "body-parser";
import express from "express";

@injectable()
export class Controllers {
  user: UserController;
  device: DeviceController;
  constructor(
    @inject(UserController) user: UserController,
    @inject(DeviceController) device: DeviceController
  ) {
    this.user = user;
    this.device = device;
  }
}

@injectable()
export class Services {
  users: DatabaseService<UserModel, UserEntry>;
  devices: DatabaseService<DeviceModel>;
  linq: LinqNetworkService;
  constructor(
    @inject(SYMBOLS.DATABASE_USER) users: DatabaseService<UserModel, UserEntry>,
    @inject(SYMBOLS.DATABASE_DEVICE) devices: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE) linq: LinqNetworkService
  ) {
    this.users = users;
    this.devices = devices;
    this.linq = linq;
  }
}

@injectable()
export class App {
  container!: Container;
  server: express.Application;
  services: Services;
  constructor(
    @inject(Controllers) private controllers: Controllers,
    @inject(Services) services: Services
  ) {
    this.services = services;
    this.server = express();
  }

  use(...args: any[]): App {
    this.server.use(...args);
    return this;
  }

  load(): App {
    let controllers = [this.controllers.user, this.controllers.device];

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
