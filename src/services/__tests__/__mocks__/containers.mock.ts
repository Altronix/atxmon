import { SYMBOLS } from "../../../ioc/constants.root";
import {
  DatabaseService,
  Repository,
  UserModel,
  DatabaseConstructor,
  UserEntry,
  DeviceModel
} from "../../types";
import { UtilRoutines } from "../../../common/types";
import { Repository as TypeormRepository } from "typeorm";
import { OrmRepository } from "../../orm/typeorm";
import { DeviceEntity } from "../../orm/entities/device.entity";
import { UserEntity } from "../../orm/entities/user.entity";
import { Container, decorate, injectable } from "inversify";

import { DeviceService } from "../../device.service";
import { UserService } from "../../user.service";
jest.mock("../../device.service"); // Blocking metadata
jest.mock("../../user.service"); // Blocking metadata

// NOTE jest.mock("./some/file") will block injectable metadata so we
// need to redecroate
decorate(injectable(), DeviceService);
decorate(injectable(), UserService);

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
  container.rebind<DatabaseService<Model, Entry>>(dbSymbol).to(db);
}

export default (container: Container): Container => {
  // (!) Not real, mocks don't need real repositories
  let users!: TypeormRepository<UserEntity>;
  let devices!: TypeormRepository<DeviceEntity>;

  rebindRepository(container, users, SYMBOLS.ORM_REPOSITORY_USER);
  rebindRepository(container, devices, SYMBOLS.ORM_REPOSITORY_DEVICE);
  rebindDatabase(container, DeviceService, SYMBOLS.DATABASE_DEVICE);
  rebindDatabase(container, UserService, SYMBOLS.DATABASE_USER);

  return container;
};
