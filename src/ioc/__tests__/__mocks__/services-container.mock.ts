import { SYMBOLS } from "../../../ioc/constants.root";
import { DatabaseService, Repository } from "../../../types";
import { UserModel, UserEntry } from "../../../models/user.model";
import { DeviceModel } from "../../../models/device.model";
import { UtilRoutines } from "../../../common/types";
import { Repository as TypeormRepository } from "typeorm";
import { DeviceEntity } from "../../../entities/device.entity";
import { UserEntity } from "../../../entities/user.entity";
import { Container, decorate, injectable } from "inversify";

import { OrmRepository } from "../../orm.service";
import { DeviceService } from "../../../services/device.service";
import { UserService } from "../../../services/user.service";
import { LinqService } from "../../../services/linq.service";
jest.mock("../../device.service");
jest.mock("../../user.service");
jest.mock("../../linq.service");

// NOTE jest.mock("./some/file") will block injectable metadata so we
// need to redecroate
decorate(injectable(), DeviceService);
decorate(injectable(), UserService);
decorate(injectable(), LinqService);

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
  db: { new (...args: any[]): any },
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
  rebindDatabase(container, LinqService, SYMBOLS.LINQ_SERVICE);

  return container;
};
