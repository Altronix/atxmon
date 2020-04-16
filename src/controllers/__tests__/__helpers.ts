import { UtilRoutines } from "../../common/types";
import { DatabaseService } from "../../services/types";
import { Repository, LinqNetworkService } from "../../services/types";
import { Controller, ControllerConstructor } from "../types";
import { MockUtils } from "../../common/__test__/__mocks__/utils.mock";
import { SYMBOLS } from "../../ioc/constants.root";
import { createContainer } from "../../ioc/container.root";
import mockDatabaseContainers from "../../services/__tests__/__mocks__/containers.mock";

export type MockedDatabase<M, E = M> = jest.Mocked<DatabaseService<M, E>>;
export type MockedLinqNetworkService = jest.Mocked<LinqNetworkService>;

// A test harness
export interface Harness<Model, Entry = Model> {
  database: MockedDatabase<Model, Entry>;
  utils: MockUtils;
  linq: MockedLinqNetworkService;
  controller: Controller<Model, Entry>;
}

export async function setup<Model, Entry = Model>(
  controllerConstructor: ControllerConstructor<Model, Entry>,
  databaseSymbol: symbol
): Promise<Harness<Model, Entry>> {
  let container = await createContainer();
  mockDatabaseContainers(container);
  let utils = container.get<MockUtils>(SYMBOLS.UTIL_ROUTINES); // TODO need mock
  let linq = container.get<MockedLinqNetworkService>(SYMBOLS.LINQ_SERVICE);
  let database = container.get<MockedDatabase<Model, Entry>>(databaseSymbol);
  let controller = new controllerConstructor(utils, database);
  return { database, linq, utils, controller };
}
