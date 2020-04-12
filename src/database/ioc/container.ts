import { SYMBOLS } from "../../ioc/constants.root";
import { AsyncContainerModule } from "inversify";

// Database Imports
import {
  Database,
  Repository,
  UserModel,
  UserEntry,
  DeviceModel
} from "../types";
import { OrmRepository, getConnection } from "../orm/typeorm";
import { DeviceEntity } from "../orm/entities/device.entity";
import { UserEntity } from "../orm/entities/user.entity";
import { Users } from "../user";
import { Devices } from "../device";
import { UtilRoutines } from "../../common/types";

const databaseBindings = new AsyncContainerModule(async bind => {
  // helpful context - https://stackoverflow.com/questions/46867437

  // Initialize database
  const c = await getConnection();
  const devices = await c.getRepository(DeviceEntity);
  const users = await c.getRepository(UserEntity);

  // Create a Users Repository
  bind<Repository<UserEntity>>(SYMBOLS.ORM_REPOSITORY_USER)
    .toDynamicValue(
      ctx =>
        new OrmRepository<UserEntity>(
          ctx.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES),
          users
        )
    )
    .inSingletonScope();

  // Create a Devices Repository
  bind<Repository<DeviceEntity>>(SYMBOLS.ORM_REPOSITORY_DEVICE)
    .toDynamicValue(
      ctx =>
        new OrmRepository<DeviceEntity>(
          ctx.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES),
          devices
        )
    )
    .inSingletonScope();

  // Create a Users Database (manages repository)
  bind<Database<UserModel, UserEntry>>(SYMBOLS.DATABASE_USER)
    .to(Users)
    .inSingletonScope();

  // Create a Devices Database (manages repository)
  bind<Database<DeviceModel>>(SYMBOLS.DATABASE_DEVICE)
    .to(Devices)
    .inSingletonScope();
});

export default databaseBindings;
