import { DeviceController } from "./device.controller";
import { RootController } from "./root.controller";
import { UserController } from "../user/user.controller";
import { injectable, inject } from "inversify";

@injectable()
export class Controllers {
  user: UserController;
  device: DeviceController;
  root: RootController;
  constructor(
    @inject(UserController) user: UserController,
    @inject(DeviceController) device: DeviceController,
    @inject(RootController) root: RootController
  ) {
    this.user = user;
    this.device = device;
    this.root = root;
  }
}
