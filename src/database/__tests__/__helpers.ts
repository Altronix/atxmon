import { NetworkedRepository, Connection, getConnection } from "../orm/typeorm";
import { EntityTarget } from "typeorm";
import { Database, Repository } from "../types";
import { UtilRoutines } from "../../common/types";
import { MockUtils } from "../../common/__test__/__mocks__/utils.mock";
import getMockUtils from "../../common/__test__/__mocks__/utils.mock";
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
  connection: Connection;
  database: Database<Model, Entry>;
  utils: MockUtils;
  file: string;
}

// Setup a test
type Constructor<Model, Entry, Entity> = {
  new (u: UtilRoutines, r: Repository<Entity>): Database<Model, Entry>;
};
export async function setup<
  Model,
  Entity,
  Entry,
  DB extends Database<Model, Entry>
>(
  e: EntityTarget<Entity>,
  db: Constructor<Model, Entry, Entity>,
  file: string
): Promise<Harness<Model, Entry>> {
  // All tests start with an empty database
  await unlinkDatabase(file);
  let utils = getMockUtils();
  let connection = await getConnection({ database: file });
  const repo = connection.getRepository<Entity>(e);
  let repository = new NetworkedRepository(utils, repo);
  let database = new db(utils, repository);
  return { file, connection, utils, database };
}

// Cleanup a test
export async function cleanup<Model, Entity>(harness: Harness<Model, Entity>) {
  await unlinkDatabase(harness.file);
  return await harness.connection.close();
}
