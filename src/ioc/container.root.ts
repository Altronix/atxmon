import "reflect-metadata";
import { Container, AsyncContainerModule } from "inversify";
import { SYMBOLS } from "./constants.root";

import { LinqDeviceManager } from "../linq/types";
import { Database, DeviceModel, UserModel, UserEntry } from "../database/types";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import databaseContainerModule from "../database/ioc/container";
import commonContainerModule from "../common/ioc/container";
import linqContainer from "../linq/ioc/container";
import controllerContainer from "../controllers/ioc/container";
import middlewareContainer from "../middleware/ioc/container";

// Combine containers
export const createContainerContext = () => {
  const container = new Container();

  // Load syncronous containers
  container.load(commonContainerModule);
  container.load(linqContainer);
  container.load(controllerContainer);
  container.load(middlewareContainer);

  // Load asyncronous containers
  const loading = container.loadAsync(databaseContainerModule);
  const waitForContainer = async () => await loading;
  return { container, waitForContainer, loading };
};

export const createContainer = async () => {
  const ctx = createContainerContext();
  await ctx.loading;
  return ctx.container;
};
