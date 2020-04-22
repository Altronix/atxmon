import {
  createConnection as typeormCreateConnection,
  Connection,
  getConnectionOptions as typeormGetConnectionOptions,
  ConnectionOptions
} from "typeorm";
import { ConnectionManager } from "./types";
import { DatabaseConfig } from "../common/types";
import { injectable } from "inversify";
export { Connection } from "typeorm";

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
    if (!this.connections[name]) {
      const opts = await this._getConnectionOptions();
      if (additionalOptions) Object.assign(opts, additionalOptions);
      this.connections[name] = await this._createConnection(opts);
      await (this.connections[name] as Connection).synchronize();
    }
    return this.connections[name] as Connection;
  }

  async closeConnection(name: string): Promise<void> {
    await (this.connections[name] as Connection).close();
    this.connections[name] = undefined;
  }

  getConnection(name: string): Connection {
    return this.connections[name] as Connection;
  }
}
