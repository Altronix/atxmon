import { SYMBOLS } from "../../../ioc/constants.root";
import { UtilRoutines } from "../../../common/types";
import { Container, decorate, injectable } from "inversify";
import { OrmRepository } from "../../orm.service";
import { Repository as TypeormRepository } from "typeorm";
import { DatabaseService, Repository } from "../../types";
import { UserModel, UserEntry } from "../../../user/user.model";
import { UserEntity } from "../../../user/user.entity";
import { UserService } from "../../../user/user.service";
import { DeviceModel } from "../../../device/device.model";
import { DeviceEntity } from "../../../device/device.entity";
import { DeviceService } from "../../../device/device.service";
import { LinqService } from "../../../device/linq.service";
jest.mock("../../../device/device.service");
jest.mock("../../../device/linq.service");
jest.mock("../../../user/user.service");

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
