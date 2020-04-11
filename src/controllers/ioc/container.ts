import { ControllerUser as CUser } from "../user.controller";
import { ControllerDevice as CDevice } from "../device.controller";
import { DeviceModel, UserModel, UserEntry } from "../../database/types";
import { Controller } from "../types";
import { ContainerModule } from "inversify";
import { SYMBOLS } from "../../ioc/constants.root";

export default new ContainerModule(bind => {
  bind<Controller<DeviceModel>>(SYMBOLS.CONTROLLER_DEVICE).to(CDevice);
  bind<Controller<UserModel, UserEntry>>(SYMBOLS.CONTROLLER_USER).to(CUser);
});
