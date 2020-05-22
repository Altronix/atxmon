export const SYMBOLS = {
  ATX_LINQ_SERVICE: Symbol.for("AltronixLinqService"),
  LINQ_SERVICE: Symbol.for("LinqService"),
  CONNECTION_PROVIDER: Symbol.for("OrmConnection"),
  ORM_REPOSITORY_USER: Symbol.for("OrmRepository<UserModel>"),
  ORM_REPOSITORY_DEVICE: Symbol.for("OrmRepository<DeviceModel>"),
  ORM_REPOSITORY_ALERT: Symbol.for("OrmRepository<AlertModel>"),
  DATABASE_USER: Symbol.for("Database<UserModel,UserEntry>"),
  DATABASE_DEVICE: Symbol.for("Database<DeviceModel,DeviceEntry>"),
  DATABASE_ALERT: Symbol.for("Database<AlertModel,AlertEntry>"),
  SHUTDOWN_SERVICE: Symbol.for("ShutdownService")
};
