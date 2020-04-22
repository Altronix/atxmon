import { UserController } from "../user/user.controller";
import { UserModel, UserEntry } from "../user/user.model";
import { DeviceController } from "../device/device.controller";
import { DeviceModel } from "../device/device.model";
import { LoginController } from "../login/login.controller";
import { Controller } from "../common/types";
import { ContainerModule } from "inversify";
import { SYMBOLS } from "./constants.root";

export default new ContainerModule(bind => {
  bind<Controller<DeviceModel>>(DeviceController).toSelf();
  bind<Controller<UserModel, UserEntry>>(UserController).toSelf();
  bind<LoginController>(LoginController).toSelf();
});
