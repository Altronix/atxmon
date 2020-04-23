import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import { DatabaseService, LinqNetworkService } from "./ioc/types";
import { DeviceController } from "./device/device.controller";
import { DeviceModel } from "./device/device.model";
import { UserController } from "./user/user.controller";
import { LoginController } from "./login/login.controller";
import { UserModel, UserEntry } from "./user/user.model";
import { UtilRoutines } from "./common/types";
import { createRouter, loadMiddleware } from "./common/decorators";
import { App, AppAnd, AppConstructorAnd } from "./common/decorators";
import { Container, injectable, inject } from "inversify";

import Config from "./config";
import * as bodyParser from "body-parser";
import express from "express";

@App({ controllers: [UserController, DeviceController, LoginController] })
export class Server {
  config: Config;
  utils: UtilRoutines;
  linq: LinqNetworkService;
  devices: DatabaseService<DeviceModel>;
  users: DatabaseService<UserModel, UserEntry>;
  app: express.Application;
  constructor(
    @inject(Config) config: Config,
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) users: DatabaseService<UserModel, UserEntry>,
    @inject(SYMBOLS.DATABASE_DEVICE) devices: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE) linq: LinqNetworkService
  ) {
    this.config = config;
    this.utils = utils;
    this.linq = linq;
    this.users = users;
    this.devices = devices;
    this.app = express();
  }
}

export default async () => {
  let container = await createContainer();
  loadMiddleware(container);
  let app = container.get<AppAnd<Server>>(SYMBOLS.APP_SERVER);
  app.load(container);
  return app;
};
