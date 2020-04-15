import { UserController } from "../user.controller";
import { DeviceController } from "../device.controller";
import { RootController } from "../root.controller";
import { DeviceModel, UserModel, UserEntry } from "../../services/types";
import { Controller } from "../types";
import { ContainerModule } from "inversify";
import { SYMBOLS } from "../../ioc/constants.root";

export default new ContainerModule(bind => {
  bind<Controller<DeviceModel>>(DeviceController).toSelf();
  bind<Controller<UserModel, UserEntry>>(UserController).toSelf();
  bind(RootController).toSelf();
});
