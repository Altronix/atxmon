import { OrmRepository, Connection } from "../../ioc/orm.service";
import { ConnectionManager } from "../../ioc/types";
import { DatabaseConfig } from "../../common/types";
import { OrmConnection } from "../../ioc/orm.connection";
import { createConnection, getConnectionOptions, EntityTarget } from "typeorm";
import { DatabaseService, Repository } from "../../ioc/types";
import { UtilRoutines } from "../types";
import { MockUtils } from "./__mocks__/utils.mock";
import getMockUtils from "./__mocks__/utils.mock";
import Config from "../../config";
import * as fs from "fs";

// Remove a database from the host file system (integration test)
export async function unlinkDatabase(db: string) {
  let ret: void | null;
  try {
    ret = (await fs.promises.stat(db)) ? await fs.promises.unlink(db) : null;
  } catch (e) {
    // console.log(e); // probably ENOENT
  }
  return ret;
}

// A test harness
export interface Harness<Model, Entry> {
  config: DatabaseConfig;
  connection: Connection;
  connectionManager: ConnectionManager;
  database: DatabaseService<Model, Entry>;
  utils: MockUtils;
  file: string;
}

/**
 * TODO Test suite seems to require database name to be "default". If the test
 * database name is not "default", then the first test will pass, but
 * subsequent tests will fail explaining they can't find a 'default' database.
 * This only occurs when we run our tests with out using ormconfig.
 */
export async function setup<Entity, Model, Entry = Model>(
  e: EntityTarget<Entity>,
  db: { new (...args: any[]): DatabaseService<Model, Entry> },
  file: string
): Promise<Harness<Model, Entry>> {
  // All tests start with an empty database
  await unlinkDatabase(file);
  let utils = getMockUtils();
  let config = Object.assign(new Config().database, {
    database: file,
    name: "default" // hmmm (see above)
  });
  let connectionManager = new OrmConnection(
    createConnection,
    getConnectionOptions,
    config
  );
  let connection = await connectionManager.createConnection(config.name);
  let provider = async () => connectionManager;
  let repository = new OrmRepository<Entity>(provider);
  let database = new db(utils, repository);
  await repository.load(config.name, e);
  return { file, config, connection, connectionManager, utils, database };
}

// Cleanup a test
export async function cleanup<Model, Entity>(harness: Harness<Model, Entity>) {
  await harness.connectionManager.closeConnection(harness.config.name);
  await unlinkDatabase(harness.file);
}
