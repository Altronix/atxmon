import {
  OrmRepository,
  Connection,
  getConnection
} from "../../ioc/orm.service";
import { EntityTarget } from "typeorm";
import { DatabaseService, Repository } from "../../ioc/types";
import { UtilRoutines } from "../types";
import { MockUtils } from "./__mocks__/utils.mock";
import getMockUtils from "./__mocks__/utils.mock";
import load from "../../config";
import * as fs from "fs";

// Remove a database from the host file system (integration test)
async function unlinkDatabase(db: string) {
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
  connection: Connection;
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
  let opts = Object.assign(load([], process.env).database, {
    database: file,
    name: "default"
  });
  let connection = await getConnection(opts);
  const repo = await connection.getRepository<Entity>(e);
  let repository = new OrmRepository(utils, repo);
  let database = new db(utils, repository);
  return { file, connection, utils, database };
}

// Cleanup a test
export async function cleanup<Model, Entity>(harness: Harness<Model, Entity>) {
  await harness.connection.close();
  await unlinkDatabase(harness.file);
}
