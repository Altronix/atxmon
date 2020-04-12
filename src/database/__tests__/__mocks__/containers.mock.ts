import { SYMBOLS } from "../../../ioc/constants.root";
import { Container } from "inversify";
import {
  Database,
  Repository,
  UserModel,
  DatabaseConstructor,
  UserEntry,
  DeviceModel
} from "../../../database/types";
import { UtilRoutines } from "../../../common/types";
import { Repository as OrmRepository } from "typeorm";
import { NetworkedRepository } from "../../../database/orm/typeorm";
import { DeviceEntity } from "../../../database/orm/entities/device.entity";
import { UserEntity } from "../../../database/orm/entities/user.entity";
import { injectable } from "inversify";

import { Devices } from "../../../database/device";
import { Users } from "../../../database/user";
jest.mock("../../../database/device"); // Blocking metadata
jest.mock("../../../database/user"); // Blocking metadata

function rebindRepository<Entity>(
  c: Container,
  orm: OrmRepository<Entity>,
  sym: symbol
): void {
  c.rebind<Repository<Entity>>(sym).toDynamicValue(
    ctx =>
      new NetworkedRepository(
        ctx.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES),
        orm
      )
  );
}

function rebindDatabase<Entity, Model, Entry = Model>(
  container: Container,
  db: DatabaseConstructor<Entity, Model, Entry>,
  sym: symbol
) {
  container.rebind<Database<Model, Entry>>(sym).to(db);
}

export default (container: Container): Container => {
  // (!) Not real, mocks don't need real repositories
  let users!: OrmRepository<UserEntity>;
  let devices!: OrmRepository<DeviceEntity>;

  rebindRepository(container, users, SYMBOLS.REPOSITORY_USER);
  rebindRepository(container, devices, SYMBOLS.REPOSITORY_DEVICE);

  // NOTE jest.mock("./some/file") will block injectable metadata so we
  // instantiate mock ourself
  container
    .rebind<Database<DeviceModel>>(SYMBOLS.DATABASE_DEVICE)
    .toDynamicValue(
      ctx =>
        new Devices(
          ctx.container.get(SYMBOLS.UTIL_ROUTINES),
          ctx.container.get(SYMBOLS.REPOSITORY_DEVICE)
        )
    );

  container
    .rebind<Database<UserModel, UserEntry>>(SYMBOLS.DATABASE_USER)
    .toDynamicValue(
      ctx =>
        new Users(
          ctx.container.get(SYMBOLS.UTIL_ROUTINES),
          ctx.container.get(SYMBOLS.REPOSITORY_USER)
        )
    );

  return container;
};
