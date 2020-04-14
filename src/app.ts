import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import { LinqDeviceManager } from "./linq/types";
import { Users } from "./database/user";
import log from "./common/logger";

import { UserController } from "./controllers/user.controller";
import { RootController } from "./controllers/root.controller";
import { DeviceController } from "./controllers/device.controller";

// TODO - refactor ugly container cruft out of app.js
import * as bodyParser from "body-parser";
import * as express from "express";

// TODO - ormconfig.js is importing typescript when running app directly
// Need to override entities

log("info", "starting app...");

(async () => {
  let container = await createContainer();
  // let server = new InversifyExpressServer(container);
  // server.setConfig(app => {
  //   app.use(bodyParser.urlencoded({ extended: true }));
  //   app.use(bodyParser.json());
  // });
  // server.build().listen(3000);
  let linq = container.get<LinqDeviceManager>(SYMBOLS.LINQ_DEVICE_MANAGER);
  let users = container.get<Users>(SYMBOLS.DATABASE_USER);
  let user = await users.create({ name: "Thomas", pass: "Secret", role: 0 });
  await linq.listen("tcp://*:33455").run(100);
})();
