export const SYMBOLS = {
  ATX_LINQ_SERVICE: Symbol.for("AltronixLinqService"),
  LINQ_SERVICE: Symbol.for("LinqService"),
  ORM_CONNECTION: Symbol.for("OrmConnection"),
  ORM_REPOSITORY_USER: Symbol.for("OrmRepository<UserModel>"),
  ORM_REPOSITORY_DEVICE: Symbol.for("OrmRepository<DeviceModel>"),
  DATABASE_USER: Symbol.for("Database<UserModel,UserEntry>"),
  DATABASE_DEVICE: Symbol.for("Database<DeviceModel,DeviceEntry>")
};
