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
import { NetworkedRepository, getConnection } from "../orm/typeorm";
import { DeviceEntity } from "../orm/entities/device.entity";
import { UserEntity } from "../orm/entities/user.entity";
import { Users } from "../user";
import { Devices } from "../device";
import { UtilRoutines } from "../../common/types";

const databaseBindings = new AsyncContainerModule(async bind => {
  // helpful context - https://stackoverflow.com/questions/46867437

  // Initialize database
  const c = await getConnection();

  // Create a Users Repository
  const users = await c.getRepository(UserEntity);
  bind<Repository<UserModel>>(SYMBOLS.REPOSITORY_USER)
    .toDynamicValue(
      ctx =>
        new NetworkedRepository<UserEntity>(
          ctx.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES),
          users
        )
    )
    .inSingletonScope();

  // Create a Devices Repository
  const devices = await c.getRepository(DeviceEntity);
  bind<Repository<DeviceModel>>(SYMBOLS.REPOSITORY_DEVICE)
    .toDynamicValue(
      ctx =>
        new NetworkedRepository<DeviceEntity>(
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
