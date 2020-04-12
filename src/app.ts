import { createContainer } from "./ioc/container.root";
import { SYMBOLS } from "./ioc/constants.root";
import { LinqDeviceManager } from "./linq/types";
import { Users } from "./database/user";
import log from "./common/logger";

// TODO - ormconfig.js is importing typescript when running app directly
// Need to override entities

// TODO - refactor ugly container cruft out of app.js

log("info", "starting app...");

(async () => {
  let container = await createContainer();
  let linq = container.get<LinqDeviceManager>(SYMBOLS.LINQ_DEVICE_MANAGER);
  let users = container.get<Users>(SYMBOLS.DATABASE_USER);
  let user = await users.create({ name: "Thomas", pass: "Secret", role: 0 });
  await linq.listen("tcp://*:33455").run(100);
})();
