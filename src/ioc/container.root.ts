import "reflect-metadata";
import { Container, AsyncContainerModule } from "inversify";
import { SYMBOLS } from "./constants.root";

import { DatabaseService } from "./types";
import {
  LoggerRoutines,
  CryptoRoutines,
  UtilRoutines,
  Environment
} from "../common/types";

import serviceContainerModule from "./services-container";
import commonContainerModule from "./common-container";
import controllerContainer from "./controllers-container";
import { Server } from "../server";

// Combine containers
export const createContainerContext = (env?: Environment) => {
  const container = new Container();

  // Load app containers
  container.bind(Server).toSelf();

  // Load syncronous containers
  container.load(commonContainerModule);
  container.load(controllerContainer);

  // Load asyncronous containers
  const loading = container.loadAsync(serviceContainerModule(env));
  const waitForContainer = async () => await loading;
  return { container, waitForContainer, loading };
};

export const createContainer = async () => {
  const ctx = createContainerContext();
  await ctx.loading;
  return ctx.container;
};
