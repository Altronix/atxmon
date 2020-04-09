import { Repository, Database, DeviceModel } from "./types";
import { UtilRoutines } from "../common/types";
import { SYMBOLS } from "../ioc/constants";
import { inject, injectable } from "inversify";

@injectable()
export class Devices implements Database<DeviceModel> {
  utils: UtilRoutines;
  repository: Repository<DeviceModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.REPOSITORY_DEVICE) repository: Repository<DeviceModel>
  ) {
    this.utils = utils;
    this.repository = repository;
  }

  async create(d: DeviceModel) {
    return this.repository.insert(d);
  }

  async find(
    key: keyof DeviceModel,
    value: string | number
  ): Promise<DeviceModel | undefined> {
    return this.repository.find(key, value);
  }
}
