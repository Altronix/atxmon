import { getUsers } from "./ioc/ioc_config";
import { linq } from "./ioc/ioc_config";
import log from "./common/logger";

// TODO - ormconfig.js is importing typescript when running app directly
// Need to override entities

log("info", "starting app...");

(async () => {
  let users = await getUsers();
  let user = await users.create({ name: "Thomas", pass: "Secret", role: 0 });
  await linq.listen("tcp://*:33455").run(100);
})();
