import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import { UserService } from "./services/user.service";
import log from "./common/logger";

import { UserController } from "./controllers/user.controller";
import { RootController } from "./controllers/root.controller";
import { DeviceController } from "./controllers/device.controller";
import { createRouter } from "./decorators";

import * as bodyParser from "body-parser";
import { boot } from "./boot";

// TODO - ormconfig.js is importing typescript when running app directly
// Need to override entities

log("info", "starting app...");

(async () => {
  let container = await createContainer();
  let server = boot({
    container,
    controllers: [UserController]
  });
  server.app.use(bodyParser.urlencoded({ extended: true }));
  server.app.use(bodyParser.json());
  server.app.listen(3000);
  // let linq = container.get<LinqDeviceManager>(SYMBOLS.LINQ_DEVICE_MANAGER);
  let users = container.get<UserService>(SYMBOLS.DATABASE_USER);
  let user = await users.create({ name: "Thomas", pass: "Secret", role: 0 });
  // await linq.listen("tcp://*:33455").run(100);
})();
