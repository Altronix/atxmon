import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import { LinqDeviceManager } from "./linq/types";
import { Users } from "./database/user";
import log from "./common/logger";

import { UserController } from "./controllers/user.controller";
import { RootController } from "./controllers/root.controller";
import { DeviceController } from "./controllers/device.controller";
import { createRouter } from "./controllers/decorators";
import express, { Router } from "express";
import { Container } from "inversify";
import { METADATA_KEY } from "./controllers/ioc/constants";

import * as bodyParser from "body-parser";

// TODO - ormconfig.js is importing typescript when running app directly
// Need to override entities

log("info", "starting app...");

(async () => {
  let container = await createContainer();
  testfn(container);
  // let app = express();
  // let router = createRouter(container, UserController);
  // app.use(router.ctrl);
  // app.listen(3000);
  let linq = container.get<LinqDeviceManager>(SYMBOLS.LINQ_DEVICE_MANAGER);
  let users = container.get<Users>(SYMBOLS.DATABASE_USER);
  let user = await users.create({ name: "Thomas", pass: "Secret", role: 0 });
  await linq.listen("tcp://*:33455").run(100);
})();

function testfn(c: Container) {
  let u = c.get<UserController>(SYMBOLS.CONTROLLER_USER);
  let m;
  m = Reflect.getMetadata(METADATA_KEY.controllerMethod, u.constructor);
  console.log(m);
}
