import { UserController } from "../user/user.controller";
import { UserModel, UserEntry } from "../user/user.model";
import { DeviceController } from "../controllers/device.controller";
import { RootController } from "../controllers/root.controller";
import { Controllers } from "../controllers/controllers";
import { DeviceModel } from "../models/device.model";
import { Controller } from "../types";
import { ContainerModule } from "inversify";
import { SYMBOLS } from "./constants.root";

export default new ContainerModule(bind => {
  bind<Controller<DeviceModel>>(DeviceController).toSelf();
  bind<Controller<UserModel, UserEntry>>(UserController).toSelf();
  bind(RootController).toSelf();
  bind(Controllers).toSelf();
});
