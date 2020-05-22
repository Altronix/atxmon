import {
  DatabaseDeepPartialEntity,
  Repository,
  DatabaseService,
  FindCriteria,
  IdCriteria
} from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";
import { DeviceModel } from "./device.model";
import { DeviceEntity } from "./device.entity";
import { UtilRoutines } from "../common/types";
import { inject, injectable } from "inversify";

type DeviceModelCreate = Omit<DeviceModel, "last_seen">;

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

  async create(d: DeviceModelCreate) {
    const last_seen = Math.floor(new Date().getTime() / 1000);
    return this.repository.insert({ ...d, last_seen });
  }

  async findById(key: IdCriteria): Promise<DeviceModel | undefined> {
    return this.repository.findById(key);
  }

  async find(key?: FindCriteria<DeviceModel>): Promise<DeviceModel[]> {
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
