import { SYMBOLS } from "../../../ioc/constants.root";
import {
  Database,
  Repository,
  UserModel,
  DatabaseConstructor,
  UserEntry,
  DeviceModel
} from "../../../database/types";
import { UtilRoutines } from "../../../common/types";
import { Repository as TypeormRepository } from "typeorm";
import { OrmRepository } from "../../../database/orm/typeorm";
import { DeviceEntity } from "../../../database/orm/entities/device.entity";
import { UserEntity } from "../../../database/orm/entities/user.entity";
import { Container, decorate, injectable } from "inversify";

import { Devices } from "../../../database/device";
import { Users } from "../../../database/user";
jest.mock("../../../database/device"); // Blocking metadata
jest.mock("../../../database/user"); // Blocking metadata

// NOTE jest.mock("./some/file") will block injectable metadata so we
// need to redecroate
decorate(injectable(), Devices);
decorate(injectable(), Users);

function rebindRepository<Entity>(
  c: Container,
  orm: TypeormRepository<Entity>,
  sym: symbol
): void {
  c.rebind<Repository<Entity>>(sym).toDynamicValue(
    ctx =>
      new OrmRepository(
        ctx.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES),
        orm
      )
  );
}

function rebindDatabase<Entity, Model, Entry = Model>(
  container: Container,
  db: DatabaseConstructor<Entity, Model, Entry>,
  dbSymbol: symbol
) {
  container.rebind<Database<Model, Entry>>(dbSymbol).to(db);
}

export default (container: Container): Container => {
  // (!) Not real, mocks don't need real repositories
  let users!: TypeormRepository<UserEntity>;
  let devices!: TypeormRepository<DeviceEntity>;

  rebindRepository(container, users, SYMBOLS.ORM_REPOSITORY_USER);
  rebindRepository(container, devices, SYMBOLS.ORM_REPOSITORY_DEVICE);
  rebindDatabase(container, Devices, SYMBOLS.DATABASE_DEVICE);
  rebindDatabase(container, Users, SYMBOLS.DATABASE_USER);

  return container;
};
