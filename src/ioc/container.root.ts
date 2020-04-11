import "reflect-metadata";
import { Container, AsyncContainerModule } from "inversify";
import { SYMBOLS } from "./constants.root";

import { Linq } from "../linq/linq";
import { Database, DeviceModel, UserModel, UserEntry } from "../database/types";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import databaseContainerModule from "../database/ioc/container";
import commonContainerModule from "../common/ioc/container";
import linqContainer from "../linq/ioc/container";
import controllerContainer from "../controllers/ioc/container";

// Combine containers
export const createContainer = () => {
  const container = new Container();

  // Load syncronous containers
  container.load(commonContainerModule);
  container.load(linqContainer);
  container.load(controllerContainer);

  // Load asyncronous containers
  const loading = container.loadAsync(databaseContainerModule);
  const waitForContainer = async () => await loading;
  return { container, waitForContainer, loading };
};

// TODO below here can be deprecated, just useful for testing

const c = createContainer();

// Export Class instance
export const logger = c.container.get<LoggerRoutines>(SYMBOLS.LOGGER_ROUTINES);
export const utils = c.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES);
export const linq = c.container.get<Linq>(Linq);

// Export Async Class instance
export const getUsers = async () => {
  await c.waitForContainer();
  return c.container.get<Database<UserModel, UserEntry>>(SYMBOLS.DATABASE_USER);
};

export const getDevices = async () => {
  await c.waitForContainer();
  return c.container.get<Database<DeviceModel>>(SYMBOLS.DATABASE_DEVICE);
};

export default createContainer;
