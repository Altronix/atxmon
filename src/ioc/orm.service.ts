import {
  createConnection as typeormCreateConnection,
  Connection,
  getConnectionOptions as typeormGetConnectionOptions,
  ConnectionOptions,
  Repository as TypeormRepository
} from "typeorm";
import {
  DatabaseDeepPartialEntity,
  Repository,
  IdCriteria,
  FindCriteria,
  ConnectionManager
} from "./types";
import { UtilRoutines, DatabaseConfig } from "../common/types";
import { injectable } from "inversify";
export { Connection } from "typeorm";

const connections: { [key: string]: Connection | undefined } = {};

export async function createConnection(
  name: string,
  additionalOptions: Partial<DatabaseConfig>
): Promise<Connection> {
  if (!connections[name]) {
    const opts = await typeormGetConnectionOptions();
    if (additionalOptions) Object.assign(opts, additionalOptions);
    connections[name] = await typeormCreateConnection(opts);
    await (connections[name] as Connection).synchronize();
  }
  return connections[name] as Connection;
}

export async function closeConnection(name: string): Promise<void> {
  await (connections[name] as Connection).close();
  connections[name] = undefined;
}

export function getConnection(name: string): Connection {
  return connections[name] as Connection;
}

@injectable()
export class OrmConnection implements ConnectionManager {
  private connections: { [key: string]: Connection | undefined } = {};
  constructor(
    private _createConnection: typeof typeormCreateConnection,
    private _getConnectionOptions: typeof typeormGetConnectionOptions
  ) {}

  async createConnection(
    name: string,
    additionalOptions: Partial<DatabaseConfig>
  ): Promise<Connection> {
    if (!connections[name]) {
      const opts = await this._getConnectionOptions();
      if (additionalOptions) Object.assign(opts, additionalOptions);
      connections[name] = await this._createConnection(opts);
      await (connections[name] as Connection).synchronize();
    }
    return connections[name] as Connection;
  }

  async closeConnection(name: string): Promise<void> {
    await (connections[name] as Connection).close();
    connections[name] = undefined;
  }

  getConnection(name: string): Connection {
    return connections[name] as Connection;
  }
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
