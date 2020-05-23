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
import { DatabaseConfig } from "../common/types";
import { injectable, inject } from "inversify";
export { Connection } from "typeorm";

@injectable()
export class OrmRepository<E> implements Repository<E> {
  repository!: TypeormRepository<E>;
  constructor(
    @inject(SYMBOLS.CONNECTION_PROVIDER)
    private connection: () => Promise<ConnectionManager>
  ) {}

  async load(name: string, e: EntityTarget<E>): Promise<void> {
    let c = await this.connection();
    this.repository = c.getConnection(name).getRepository(e);
  }
}
