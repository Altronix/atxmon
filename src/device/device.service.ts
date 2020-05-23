import {
  DatabaseDeepPartialEntity,
  DatabaseService,
  FindCriteria,
  IdCriteria
} from "../ioc/types";
import { OrmRepository } from "../ioc/orm.service";
import { SYMBOLS } from "../ioc/constants.root";
import { DeviceModel } from "./device.model";
import { DeviceEntity } from "./device.entity";
import { UtilRoutines } from "../common/types";
import { inject, injectable } from "inversify";

type DeviceModelCreate = Omit<DeviceModel, "last_seen">;

@injectable()
export class DeviceService implements DatabaseService<DeviceModel> {
  utils: UtilRoutines;
  orm: OrmRepository<DeviceModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.ORM_REPOSITORY_DEVICE)
    orm: OrmRepository<DeviceEntity>
  ) {
    this.utils = utils;
    this.orm = orm;
  }

  async create(d: DeviceModelCreate) {
    const last_seen = Math.floor(new Date().getTime() / 1000);
    let ret = await this.orm.repository.insert({ ...d, last_seen });
    return true;
  }

  async findById(key: IdCriteria): Promise<DeviceModel | undefined> {
    let ret = await this.orm.repository.findByIds([key]);
    return ret.length ? ret[0] : undefined;
  }

  async find(
    where?: FindCriteria<DeviceModel>,
    sort?: keyof DeviceModel,
    limit?: number
  ): Promise<DeviceModel[]> {
    let config = {};
    if (where) Object.assign(config, { where: where });
    if (sort) Object.assign(config, { order: { [`${sort}`]: "ASC" } });
    if (limit) Object.assign(config, { take: limit });
    let ret = await this.orm.repository.find(config); // ie: take:10
    return ret;
  }

  async remove(key: FindCriteria<DeviceModel> | IdCriteria): Promise<number> {
    // NOTE - TypeORM always returns undefined for "affected"
    // Should open up an issue however there are 1000+ issues already
    // If need better return value, use "remove";
    let ret = await this.orm.repository.delete(key);
    return ret.affected ? ret.affected : 0;
  }

  async update(
    key: FindCriteria<DeviceModel> | IdCriteria,
    next: DatabaseDeepPartialEntity<DeviceModel>
  ): Promise<number> {
    // NOTE - TypeORM always returns undefined for "affected"
    // Should open up an issue however there are 1000+ issues already
    // If need better return value, use "remove";
    let ret = await this.orm.repository.update(key, next);
    return ret.affected ? ret.affected : 0;
  }

  async count(key?: FindCriteria<DeviceModel>): Promise<number> {
    return this.orm.repository.count(key);
  }
}
