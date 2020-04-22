import {
  createConnection as typeormCreateConnection,
  Connection,
  getConnectionOptions as typeormGetConnectionOptions,
  ConnectionOptions,
  Repository as TypeormRepository,
  EntityTarget
} from "typeorm";
import {
  DatabaseDeepPartialEntity,
  Repository,
  IdCriteria,
  FindCriteria,
  ConnectionManager
} from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { UtilRoutines, DatabaseConfig } from "../common/types";
import { injectable, inject } from "inversify";
export { Connection } from "typeorm";

@injectable()
export class OrmRepository<E> implements Repository<E> {
  repository!: TypeormRepository<E>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.CONNECTION_PROVIDER)
    private connection: () => Promise<ConnectionManager>
  ) {
    this.utils = utils;
  }

  async load(name: string, e: EntityTarget<E>): Promise<void> {
    let c = await this.connection();
    this.repository = c.getConnection(name).getRepository(e);
  }

  async insert(
    entities: DatabaseDeepPartialEntity<E> | DatabaseDeepPartialEntity<E>[]
  ): Promise<boolean> {
    this.utils.logger.info(JSON.stringify(entities));
    try {
      let ret = await this.repository.insert(entities);
      return true;
    } catch (err) {
      this.utils.logger.error(err);
      return false;
    }
  }

  async findById(key: IdCriteria): Promise<E | undefined> {
    let ret: E[] = [];
    try {
      ret = await this.repository.findByIds([key]);
    } catch {}
    return ret.length ? ret[0] : undefined;
  }

  async find(key?: FindCriteria<E>): Promise<E[]> {
    let ret: E[] = [];
    try {
      ret = await this.repository.find(key);
    } catch {}
    return ret;
  }

  async remove(key: FindCriteria<E> | IdCriteria): Promise<number> {
    // NOTE - TypeORM always returns undefined for "affected"
    // Should open up an issue however there are 1000+ issues already
    // If need better return value, use "remove";
    let result = await this.repository.delete(key);
    return result.affected ? result.affected : 0;
  }

  async update(
    key: FindCriteria<E> | IdCriteria,
    next: DatabaseDeepPartialEntity<E>
  ): Promise<number> {
    // NOTE - TypeORM always returns undefined for "affected"
    // Should open up an issue however there are 1000+ issues already
    // If need better return value, use "save";
    let result = await this.repository.update(key, next);
    return result.affected ? result.affected : 0;
  }

  async count(key?: FindCriteria<E>): Promise<number> {
    return this.repository.count(key);
  }
}
