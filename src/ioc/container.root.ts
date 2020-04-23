import "reflect-metadata";
import { Container } from "inversify";
import { SYMBOLS } from "./constants.root";

import { DatabaseService, Repository } from "./types";
import { LoggerRoutines, CryptoRoutines, UtilRoutines } from "../common/types";

import { UserEntity } from "../user/user.entity";
import { DeviceEntity } from "../device/device.entity";

import serviceContainerModule from "./services-container";
import commonContainerModule from "./common-container";
import appContainerModule from "./app-container";

// Combine containers
export const createContainerContext = () => {
  const container = new Container();

  // Load containers
  container.load(appContainerModule);
  container.load(commonContainerModule);
  container.load(serviceContainerModule);

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

export const createContainer = async () => {
  const ctx = createContainerContext();
  await ctx.loading;
  return ctx.container;
};
