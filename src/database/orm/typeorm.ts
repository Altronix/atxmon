import {
  createConnection,
  Connection,
  getConnectionOptions,
  ConnectionOptions,
  Repository as TypeormRepository
} from "typeorm";
import { DatabaseDeepPartialEntity } from "../../common/utils";
import { Repository, Criteria } from "../types";
import { UtilRoutines } from "../../common/types";
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
export class NetworkedRepository<E> implements Repository<E> {
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

  async find(key: Criteria<E>): Promise<E | undefined> {
    let ret: E | undefined = undefined;
    try {
      ret = await this.repository.findOne(key);
    } catch {}
    return ret;
  }
}
