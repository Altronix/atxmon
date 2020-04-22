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
import { OrmRepository, createConnection, getConnection } from "./orm.service";
import { OrmConnection } from "./orm.connection";
import { UtilRoutines } from "../common/types";
import Config from "../config";
import { ConnectionManager } from "./types";
import {
  createConnection as typeormCreateConnection,
  getConnectionOptions as typeormGetConnectionOptions
} from "typeorm";
// import { createConnection, getConnection } from "typeorm";
import { LinqNetwork } from "@altronix/linq-network";

decorate(injectable(), LinqNetwork);

const databaseBindings = (config?: Config) =>
  new AsyncContainerModule(async bind => {
    // helpful context - https://stackoverflow.com/questions/46867437

    // Initialize database
    // TODO deprecate
    const c = await createConnection("app", (config && config.database) || {});

    // Connection Manager
    bind<Promise<ConnectionManager>>(SYMBOLS.ORM_CONNECTION).toProvider(
      ctx => async () => {
        let c = new OrmConnection(
          typeormCreateConnection,
          typeormGetConnectionOptions,
          ctx.container.get<Config>(Config).database
        );
        await c.createConnection("app");
        return c;
      }
    );

    // Linq Service
    bind<AltronixLinqNetworkService>(SYMBOLS.ATX_LINQ_SERVICE)
      .toDynamicValue(() => new LinqNetwork())
      .inSingletonScope();
    bind<LinqNetworkService>(SYMBOLS.LINQ_SERVICE)
      .to(LinqService)
      .inSingletonScope();

    // Create a Users Repository
    bind<Repository<UserEntity>>(SYMBOLS.ORM_REPOSITORY_USER)
      .toDynamicValue(ctx => {
        // TODO get OrmConnection from container
        const connection = ctx.container.get<ConnectionManager>(
          SYMBOLS.ORM_CONNECTION
        );
        return new OrmRepository<UserEntity>(
          ctx.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES),
          getConnection("app").getRepository(UserEntity)
        );
      })
      .inSingletonScope();

    // Create a Devices Repository
    bind<Repository<DeviceEntity>>(SYMBOLS.ORM_REPOSITORY_DEVICE)
      .toDynamicValue(ctx => {
        // TODO get OrmConnection from container
        // TODO ORM_REPOSITORY_DEVICE should be ORM_PROVIDER_DEVICE
        // TODO async container module will convert PROVIDER to SERVICE
        //      with load routine
        return new OrmRepository<DeviceEntity>(
          ctx.container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES),
          getConnection("app").getRepository(DeviceEntity)
        );
      })
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
