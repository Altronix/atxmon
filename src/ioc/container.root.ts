import "reflect-metadata";
import { Container, AsyncContainerModule } from "inversify";
import { SYMBOLS } from "./constants.root";

import { DatabaseService } from "../services/types";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import serviceContainerModule from "./services-container";
import commonContainerModule from "./common-container";
import controllerContainer from "./controllers-container";
import middlewareContainer from "./middleware-container";
import { App } from "../app";

// Combine containers
export const createContainerContext = () => {
  const container = new Container();

  // Load app containers
  container.bind(App).toSelf();

  // Load syncronous containers
  container.load(commonContainerModule);
  container.load(controllerContainer);
  container.load(middlewareContainer);

  // Load asyncronous containers
  const loading = container.loadAsync(serviceContainerModule);
  const waitForContainer = async () => await loading;
  return { container, waitForContainer, loading };
};

export const createContainer = async () => {
  const ctx = createContainerContext();
  await ctx.loading;
  return ctx.container;
};
