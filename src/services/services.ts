import { SYMBOLS } from "../ioc/constants.root";
import { LinqNetworkService } from "../types";
import { DatabaseService } from "../types";
import { DeviceModel } from "../models/device.model";
import { UserModel, UserEntry } from "../user/user.model";
import { injectable, inject } from "inversify";

@injectable()
export class Services {
  users: DatabaseService<UserModel, UserEntry>;
  devices: DatabaseService<DeviceModel>;
  linq: LinqNetworkService;
  constructor(
    @inject(SYMBOLS.DATABASE_USER) users: DatabaseService<UserModel, UserEntry>,
    @inject(SYMBOLS.DATABASE_DEVICE) devices: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE) linq: LinqNetworkService
  ) {
    this.users = users;
    this.devices = devices;
    this.linq = linq;
  }
}
