import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";

import { DatabaseService, LinqNetworkService } from "./ioc/types";
import { DeviceController } from "./device/device.controller";
import { DeviceModel } from "./device/device.model";
import { UserController } from "./user/user.controller";
import { UserModel, UserEntry } from "./user/user.model";
import { UtilRoutines, Config } from "./common/types";
import {
  createRouter,
  getControllerMiddleware,
  loadMiddleware
} from "./common/decorators";
import { Container, injectable, inject } from "inversify";

import * as bodyParser from "body-parser";
import express from "express";

@injectable()
export class Server {
  utils: UtilRoutines;
  container!: Container;
  linq: LinqNetworkService;
  devices: DatabaseService<DeviceModel>;
  users: DatabaseService<UserModel, UserEntry>;
  app: express.Application;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) users: DatabaseService<UserModel, UserEntry>,
    @inject(SYMBOLS.DATABASE_DEVICE) devices: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE) linq: LinqNetworkService,
    @inject(UserController) private user: UserController,
    @inject(DeviceController) private device: DeviceController
  ) {
    this.utils = utils;
    this.linq = linq;
    this.users = users;
    this.devices = devices;
    this.app = express();
  }

  use(...args: any[]): Server {
    this.app.use(...args);
    return this;
  }

  load(): Server {
    let controllers = [this.user, this.device];

    controllers.forEach(controller =>
      this.app.use(createRouter(this.container, controller))
    );
    return this;
  }
}

export default async (config?: Config) => {
  let container = await createContainer(config);
  loadMiddleware(container);
  let app = container.get<Server>(Server);
  app.container = container;
  app.load();
  return app;
};
