import { SYMBOLS } from "./constants.root";
import {
  Container,
  ContainerModule,
  injectable,
  inject,
  decorate
} from "inversify";

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
import { DeviceEntity } from "../device/device.entity";
import { DeviceModel } from "../device/device.model";
import { DeviceService } from "../device/device.service";
import { AlertModel } from "../alert/alert.model";
import { AlertEntity } from "../alert/alert.entity";
import { AlertService } from "../alert/alert.service";
import { LinqService } from "../device/linq.service";
import { ShutdownService } from "../shutdown/shutdown.service";
import { MailerService } from "../mailer/mailer.service";
import { OrmRepository } from "./orm.service";
import { OrmConnection } from "./orm.connection";
import { UtilRoutines } from "../common/types";
import { ShutdownManager } from "../shutdown/types";
import Config from "../config";
import { ConnectionManager, Mailer } from "./types";
import {
  createConnection as typeormCreateConnection,
  getConnectionOptions as typeormGetConnectionOptions
} from "typeorm";
import { LinqNetwork } from "@altronix/linq-network";
import { MailService } from "@sendgrid/mail";

decorate(injectable(), LinqNetwork);

const sg = new MailService();

// Instansiate generics for container
@injectable()
class OrmRepositoryUser extends OrmRepository<UserEntity> {
  constructor(
    @inject(SYMBOLS.CONNECTION_PROVIDER)
    connection: () => Promise<ConnectionManager>
  ) {
    super(connection);
  }
}

@injectable()
class OrmRepositoryDevice extends OrmRepository<DeviceEntity> {
  constructor(
    @inject(SYMBOLS.CONNECTION_PROVIDER)
    connection: () => Promise<ConnectionManager>
  ) {
    super(connection);
  }
}

@injectable()
class OrmRepositoryAlert extends OrmRepository<AlertEntity> {
  constructor(
    @inject(SYMBOLS.CONNECTION_PROVIDER)
    connection: () => Promise<ConnectionManager>
  ) {
    super(connection);
  }
}

let connection: OrmConnection | undefined;
const serviceContainerModule = new ContainerModule(bind => {
  // Connection Manager
  bind<() => Promise<ConnectionManager>>(
    SYMBOLS.CONNECTION_PROVIDER
  ).toProvider(ctx => {
    return async () => {
      if (!connection) {
        connection = new OrmConnection(
          typeormCreateConnection,
          typeormGetConnectionOptions,
          ctx.container.get<Config>(Config).database
        );
        await connection.createConnection("app");
      }
      return connection;
    };
  });

  // Linq Service
  bind<AltronixLinqNetworkService>(SYMBOLS.ATX_LINQ_SERVICE)
    .toDynamicValue(() => new LinqNetwork())
    .inSingletonScope();
  bind<LinqNetworkService>(SYMBOLS.LINQ_SERVICE)
    .to(LinqService)
    .inSingletonScope();

  // Repositorys
  bind<Repository<UserEntity>>(SYMBOLS.ORM_REPOSITORY_USER)
    .to(OrmRepositoryUser)
    .inSingletonScope();
  bind<Repository<DeviceEntity>>(SYMBOLS.ORM_REPOSITORY_DEVICE)
    .to(OrmRepositoryDevice)
    .inSingletonScope();
  bind<Repository<AlertEntity>>(SYMBOLS.ORM_REPOSITORY_ALERT)
    .to(OrmRepositoryAlert)
    .inSingletonScope();

  // Create a Users Database (manages repository)
  bind<DatabaseService<UserModel, UserEntry>>(SYMBOLS.DATABASE_USER)
    .to(UserService)
    .inSingletonScope();

  // Create a Devices Database (manages repository)
  bind<DatabaseService<DeviceModel>>(SYMBOLS.DATABASE_DEVICE)
    .to(DeviceService)
    .inSingletonScope();

  // Create a Alerts Database (manages repository)
  bind<DatabaseService<AlertModel>>(SYMBOLS.DATABASE_ALERT)
    .to(AlertService)
    .inSingletonScope();

  // Shutdown Service (https://github.com/inversify/inversifyjs/issues/997)
  // (Note - need toDynamicValue() for jest runtime because jest can't handle
  // decorating EventEmitter with injectable()...)
  bind<ShutdownManager>(SYMBOLS.SHUTDOWN_SERVICE)
    .toDynamicValue(() => new ShutdownService())
    .inSingletonScope();

  // Sendgrid
  bind<Mailer>(SYMBOLS.MAILER)
    .toDynamicValue(() => sg)
    .inSingletonScope();

  // Sendgrid Wrapper
  bind<MailerService>(SYMBOLS.MAILER_SERVICE)
    .to(MailerService)
    .inSingletonScope();
});

export default serviceContainerModule;
