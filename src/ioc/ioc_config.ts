import "reflect-metadata";
import { Container, AsyncContainerModule } from "inversify";
import { SYMBOLS } from "./constants";

import { Linq } from "../linq/linq";
import { Database, DeviceModel, UserModel, UserEntry } from "../database/types";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import databaseContainerModule from "../database/ioc/ioc_container";
import commonContainerModule from "../common/ioc/ioc_container";
import linqContainer from "../linq/ioc/ioc_container";

// Combine containers
export const createContainer = () => {
  const container = new Container();
  container.load(commonContainerModule);
  container.load(linqContainer);
  const loading = container.loadAsync(databaseContainerModule);
  const waitForContainer = async () => await loading;
  return { container, waitForContainer, loading };
};

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
