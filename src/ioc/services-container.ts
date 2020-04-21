import { SYMBOLS } from "./constants.root";
import { AsyncContainerModule, injectable, decorate } from "inversify";

// Database Imports
import {
  DatabaseService,
  Repository,
  AltronixLinqNetworkService,
  LinqNetworkService
} from "./types";
import { UserModel, UserEntry } from "../user/user.model";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { DeviceModel } from "../device/device.model";
import { DeviceEntity } from "../device/device.entity";
import { DeviceService } from "../device/device.service";
import { LinqService } from "../device/linq.service";
import { OrmRepository, getConnection } from "./orm.service";
import { UtilRoutines, Config } from "../common/types";
import { LinqNetwork } from "@altronix/linq-network";

decorate(injectable(), LinqNetwork);

const databaseBindings = (config?: Config) =>
  new AsyncContainerModule(async bind => {
    // helpful context - https://stackoverflow.com/questions/46867437

    // Initialize database
    const c = await getConnection((config && config.database) || {});
    const devices = await c.getRepository(DeviceEntity);
    const users = await c.getRepository(UserEntity);

    // Linq Service
    bind<AltronixLinqNetworkService>(SYMBOLS.ATX_LINQ_SERVICE)
      .toDynamicValue(() => new LinqNetwork())
      .inSingletonScope();
    bind<LinqNetworkService>(SYMBOLS.LINQ_SERVICE)
      .to(LinqService)
      .inSingletonScope();

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
    bind<DatabaseService<UserModel, UserEntry>>(SYMBOLS.DATABASE_USER)
      .to(UserService)
      .inSingletonScope();

    // Create a Devices Database (manages repository)
    bind<DatabaseService<DeviceModel>>(SYMBOLS.DATABASE_DEVICE)
      .to(DeviceService)
      .inSingletonScope();
  });

export default (config?: Config) => databaseBindings(config);
