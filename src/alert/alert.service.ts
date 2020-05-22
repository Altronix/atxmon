import {
  DatabaseDeepPartialEntity,
  Repository,
  DatabaseService,
  FindCriteria,
  IdCriteria
} from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";
import { AlertModel } from "./alert.model";
import { AlertEntity } from "./alert.entity";
import { UtilRoutines } from "../common/types";
import { inject, injectable } from "inversify";

type AlertEntry = Omit<AlertModel, "id" | "device">;

@injectable()
export class AlertService implements DatabaseService<AlertModel, AlertEntry> {
  utils: UtilRoutines;
  repository: Repository<AlertModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.ORM_REPOSITORY_ALERT) repository: Repository<AlertEntity>
  ) {
    this.utils = utils;
    this.repository = repository;
  }

  async create(a: AlertEntry) {
    return this.repository.insert({ ...a });
  }

  async findById(key: IdCriteria): Promise<AlertModel | undefined> {
    return this.repository.findById(key);
  }

  async find(key?: FindCriteria<AlertModel>): Promise<AlertModel[]> {
    return this.repository.find(key);
  }

  async remove(key: FindCriteria<AlertModel> | IdCriteria): Promise<number> {
    return this.repository.remove(key);
  }

  async update(
    key: FindCriteria<AlertModel> | IdCriteria,
    next: DatabaseDeepPartialEntity<AlertModel>
  ): Promise<number> {
    return this.repository.update(key, next);
  }

  async count(key?: FindCriteria<AlertModel>): Promise<number> {
    return this.repository.count(key);
  }
}
