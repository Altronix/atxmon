import { UserController as CUser } from "../user.controller";
import { DeviceController as CDevice } from "../device.controller";
import { RootController } from "../root.controller";
import { DeviceModel, UserModel, UserEntry } from "../../database/types";
import { Controller } from "../types";
import { ContainerModule } from "inversify";
import { SYMBOLS } from "../../ioc/constants.root";

export default new ContainerModule(bind => {
  bind<Controller<DeviceModel>>(SYMBOLS.CONTROLLER_DEVICE).to(CDevice);
  bind<Controller<UserModel, UserEntry>>(SYMBOLS.CONTROLLER_USER).to(CUser);
  bind(SYMBOLS.CONTROLLER_ROOT).to(RootController);
});
