import { Repository, Database, Criteria, DeviceModel } from "./types";
import { UtilRoutines } from "../common/types";
import { DatabaseDeepPartialEntity } from "../common/utils";
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

  async find(key: Criteria<DeviceModel>): Promise<DeviceModel | undefined> {
    return this.repository.find(key);
  }

  async remove(key: Criteria<DeviceModel>): Promise<number> {
    return this.repository.remove(key);
  }

  async update(
    key: Criteria<DeviceModel>,
    next: DatabaseDeepPartialEntity<DeviceModel>
  ): Promise<number> {
    return this.repository.update(key, next);
  }

  async count(key?: Criteria<DeviceModel>): Promise<number> {
    return this.repository.count(key);
  }
}
