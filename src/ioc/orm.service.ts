import {
  createConnection,
  Connection,
  getConnectionOptions,
  ConnectionOptions,
  Repository as TypeormRepository
} from "typeorm";
import {
  DatabaseDeepPartialEntity,
  Repository,
  IdCriteria,
  FindCriteria
} from "./types";
import { UtilRoutines } from "../common/types";
import { injectable } from "inversify";
export { Connection } from "typeorm";

export async function getConnection(
  additionalOptions?: Partial<ConnectionOptions>
): Promise<Connection> {
  const opts = await getConnectionOptions();
  if (additionalOptions) Object.assign(opts, additionalOptions);
  const c = await createConnection(opts);
  await c.synchronize();
  return c;
}

@injectable()
export class OrmRepository<E> implements Repository<E> {
  utils: UtilRoutines;
  repository: TypeormRepository<E>;
  constructor(utils: UtilRoutines, repository: TypeormRepository<E>) {
    this.utils = utils;
    this.repository = repository;
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
