import { SYMBOLS } from "./constants.root";
import { AsyncContainerModule, injectable, decorate } from "inversify";

// Database Imports
import {
  DatabaseService,
  Repository,
  AltronixLinqNetworkService,
  LinqNetworkService
} from "../types";
import { UserModel, UserEntry } from "../models/user.model";
import { DeviceModel } from "../models/device.model";
import { DeviceEntity } from "../entities/device.entity";
import { UserEntity } from "../entities/user.entity";
import { OrmRepository, getConnection } from "./orm.service";
import { UserService } from "../services/user.service";
import { DeviceService } from "../services/device.service";
import { LinqService } from "../services/linq.service";
import { Services } from "../services/services";
import { UtilRoutines } from "../common/types";
import { LinqNetwork } from "@altronix/linq-network";

decorate(injectable(), LinqNetwork);

const databaseBindings = new AsyncContainerModule(async bind => {
  // helpful context - https://stackoverflow.com/questions/46867437

  // Initialize database
  const c = await getConnection();
  const devices = await c.getRepository(DeviceEntity);
  const users = await c.getRepository(UserEntity);

  // Linq Service (@altronix/linq-network + our inversion wrapper)
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

  // Create the services namespace
  bind(Services).toSelf();
});

export default databaseBindings;
