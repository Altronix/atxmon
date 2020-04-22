import "reflect-metadata";
import { Container, AsyncContainerModule } from "inversify";
import { SYMBOLS } from "./constants.root";

import { DatabaseService, Repository } from "./types";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import { UserEntity } from "../user/user.entity";
import { DeviceEntity } from "../device/device.entity";

import serviceContainerModule from "./services-container";
import commonContainerModule from "./common-container";
import controllerContainer from "./controllers-container";
import { Server } from "../server";
import Config from "../config";

// Combine containers
export const createContainerContext = (config?: Config) => {
  const container = new Container();

  // Load app containers
  container.bind(Server).toSelf();
  container
    .bind(Config)
    .toDynamicValue(() => new Config(process.argv, process.env));

  // Load syncronous containers
  container.load(commonContainerModule(config));
  container.load(serviceContainerModule);
  container.load(controllerContainer);

  // Resolve providers
  const loading: Promise<void> = (async () => {
    await container
      .get<Repository<UserEntity>>(SYMBOLS.ORM_REPOSITORY_USER)
      .load("app", UserEntity);

    await container
      .get<Repository<DeviceEntity>>(SYMBOLS.ORM_REPOSITORY_DEVICE)
      .load("app", DeviceEntity);
  })();
  const waitForContainer = async () => await loading;
  return { container, waitForContainer, loading };
};

export const createContainer = async (config?: Config) => {
  const ctx = createContainerContext(config);
  await ctx.loading;
  return ctx.container;
};
