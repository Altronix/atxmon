import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import { DatabaseService, LinqNetworkService } from "./ioc/types";
import { ShutdownManager } from "./shutdown/types";
import { DeviceController } from "./device/device.controller";
import { DeviceModel } from "./device/device.model";
import { UserController } from "./user/user.controller";
import { LoginController } from "./login/login.controller";
import { LogoutController } from "./logout/logout.controller";
import { ShutdownController } from "./shutdown/shutdown.controller";
import { UserModel, UserEntry } from "./user/user.model";
import { UserService } from "./user/user.service";
import { DeviceService } from "./device/device.service";
import { AlertService } from "./alert/alert.service";
import { UtilRoutines } from "./common/types";
import { createRouter, loadMiddleware } from "./common/decorators";
import { App, AppAnd, AppConstructorAnd } from "./common/decorators";
import { Container, injectable, inject } from "inversify";
import Config from "./config";
import * as bodyParser from "body-parser";
import express from "express";

@App({
  controllers: [
    UserController,
    DeviceController,
    LoginController,
    LogoutController,
    ShutdownController
  ]
})
export class _Server {
  config: Config;
  utils: UtilRoutines;
  linq: LinqNetworkService;
  devices: DeviceService;
  users: UserService;
  alerts: AlertService;
  shutdown: ShutdownManager;
  app: express.Application;
  constructor(
    @inject(Config) config: Config,
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) users: UserService,
    @inject(SYMBOLS.DATABASE_DEVICE) devices: DeviceService,
    @inject(SYMBOLS.DATABASE_ALERT) alerts: AlertService,
    @inject(SYMBOLS.LINQ_SERVICE) linq: LinqNetworkService,
    @inject(SYMBOLS.SHUTDOWN_SERVICE) shutdown: ShutdownManager
  ) {
    this.config = config;
    this.utils = utils;
    this.linq = linq;
    this.users = users;
    this.devices = devices;
    this.alerts = alerts;
    this.shutdown = shutdown;
    this.app = express(); // Inject?
  }
}

export type Server = AppAnd<_Server>;
export async function createServer() {
  let container = await createContainer();
  let app = container.get<Server>(SYMBOLS.APP_SERVER);
  app.load(container);
  return app;
}
export default createServer;
