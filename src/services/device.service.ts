import {
  DatabaseDeepPartialEntity,
  Repository,
  DatabaseService,
  FindCriteria,
  IdCriteria,
  DeviceModel
} from "./types";
import { UtilRoutines } from "../common/types";
import { SYMBOLS } from "../ioc/constants.root";
import { inject, injectable } from "inversify";
import { DeviceEntity } from "./orm/entities/device.entity";

// TODO rename to DeviceService to freeup Devices namespace
@injectable()
export class DeviceService implements DatabaseService<DeviceModel> {
  utils: UtilRoutines;
  repository: Repository<DeviceModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.ORM_REPOSITORY_DEVICE) repository: Repository<DeviceEntity>
  ) {
    this.utils = utils;
    this.repository = repository;
  }

  async create(d: DeviceModel) {
    return this.repository.insert(d);
  }

  async find(key: FindCriteria<DeviceModel>): Promise<DeviceModel | undefined> {
    return this.repository.find(key);
  }

  async remove(key: FindCriteria<DeviceModel> | IdCriteria): Promise<number> {
    return this.repository.remove(key);
  }

  async update(
    key: FindCriteria<DeviceModel> | IdCriteria,
    next: DatabaseDeepPartialEntity<DeviceModel>
  ): Promise<number> {
    return this.repository.update(key, next);
  }

  async count(key?: FindCriteria<DeviceModel>): Promise<number> {
    return this.repository.count(key);
  }
}
