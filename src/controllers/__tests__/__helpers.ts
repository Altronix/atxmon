import { UtilRoutines } from "../../common/types";
import { Database, DatabaseConstructor } from "../../database/types";
import { Repository } from "../../database/types";
import { NetworkedRepository } from "../../database/orm/typeorm";
import { Controller, ControllerConstructor } from "../types";
import mockUtils, {
  MockUtils
} from "../../common/__test__/__mocks__/utils.mock";

export type MockedDatabase<M, E> = jest.Mocked<Database<M, E>>;

export type MockedDatabaseConstructor<Entity, Model, Entry = Model> = {
  new (u: UtilRoutines, r: Repository<Entity>): jest.Mocked<
    Database<Model, Entry>
  >;
};

// This is just for type casting a database to a mocked database
export function Mocked<Entity, Model, Entry = Model>(
  db: DatabaseConstructor<Entity, Model, Entry>
): MockedDatabaseConstructor<Entity, Model, Entry> {
  return db as MockedDatabaseConstructor<Entity, Model, Entry>;
}

// A test harness
export interface Harness<Entity, Model, Entry = Model> {
  database: jest.Mocked<Database<Model, Entry>>;
  utils: MockUtils;
  controller: Controller<Model, Entry>;
}

export function setup<Entity, Model, Entry = Model>(
  db: MockedDatabaseConstructor<Entity, Model, Entry>,
  c: ControllerConstructor<Model, Entry>
): Harness<Entity, Model, Entry> {
  let utils = mockUtils();
  let repo!: Repository<Entity>;
  let database = (new db(utils, repo) as any) as MockedDatabase<Model, Entry>;
  let controller = new c(utils, database);
  return { database, utils, controller };
}
