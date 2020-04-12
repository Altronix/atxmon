import { UtilRoutines } from "../../common/types";
import { Database, DatabaseConstructor } from "../../database/types";
import { Repository } from "../../database/types";
import { NetworkedRepository } from "../../database/orm/typeorm";
import { Controller, ControllerConstructor } from "../types";
import mockUtils, {
  MockUtils
} from "../../common/__test__/__mocks__/utils.mock";
import { SYMBOLS } from "../../ioc/constants.root";
import { createContainer } from "../../ioc/container.root";
import mockDatabaseContainers from "../../database/__tests__/__mocks__/containers.mock";

export type MockedDatabase<M, E = M> = jest.Mocked<Database<M, E>>;

// A test harness
export interface Harness<Model, Entry = Model> {
  database: jest.Mocked<Database<Model, Entry>>;
  utils: MockUtils;
  controller: Controller<Model, Entry>;
}

export async function setup<Model, Entry = Model>(
  constructor: ControllerConstructor<Model, Entry>,
  controllerSymbol: symbol,
  databaseSymbol: symbol
): Promise<Harness<Model, Entry>> {
  let container = await createContainer();
  mockDatabaseContainers(container);
  let utils = container.get<MockUtils>(SYMBOLS.UTIL_ROUTINES); // TODO need mock
  let controller = container.get<Controller<Model, Entry>>(controllerSymbol);
  let database = container.get<MockedDatabase<Model, Entry>>(databaseSymbol);
  return { database, utils, controller };
}