import {
  DatabaseDeepPartialEntity,
  DatabaseService,
  FindCriteria,
  IdCriteria
} from "../ioc/types";
import { OrmRepository } from "../ioc/orm.service";
import { SYMBOLS } from "../ioc/constants.root";
import { AlertModel, AlertEntry } from "./alert.model";
import { AlertEntity } from "./alert.entity";
import { UtilRoutines } from "../common/types";
import { inject, injectable } from "inversify";

@injectable()
export class AlertService implements DatabaseService<AlertModel, AlertEntry> {
  utils: UtilRoutines;
  orm: OrmRepository<AlertModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.ORM_REPOSITORY_ALERT) orm: OrmRepository<AlertEntity>
  ) {
    this.utils = utils;
    this.orm = orm;
  }

  async create(a: AlertEntry) {
    let ret = await this.orm.repository.insert({ ...a });
    return true;
  }

  async findById(key: IdCriteria): Promise<AlertModel | undefined> {
    let ret = await this.orm.repository.findByIds([key]);
    return ret.length ? ret[0] : undefined;
  }

  async find(
    where?: FindCriteria<AlertModel>,
    sort?: keyof AlertModel,
    limit?: number
  ): Promise<AlertModel[]> {
    let config = {};
    if (where) Object.assign(config, { where: where });
    if (sort) Object.assign(config, { order: { [`${sort}`]: "ASC" } });
    if (limit) Object.assign(config, { take: limit });
    let ret = await this.orm.repository.find(config); // ie: take:10
    return ret;
  }

  async remove(key: FindCriteria<AlertModel> | IdCriteria): Promise<number> {
    let ret = await this.orm.repository.delete(key);
    return ret.affected ? ret.affected : 0;
  }

  async update(
    key: FindCriteria<AlertModel> | IdCriteria,
    next: DatabaseDeepPartialEntity<AlertModel>
  ): Promise<number> {
    let ret = await this.orm.repository.update(key, next);
    return ret.affected ? ret.affected : 0;
  }

  async count(key?: FindCriteria<AlertModel>): Promise<number> {
    return this.orm.repository.count(key);
  }
}
