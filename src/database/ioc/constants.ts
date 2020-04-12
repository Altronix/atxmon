export const SYMBOLS = {
  ORM_REPOSITORY_USER: Symbol.for("OrmRepository<UserModel>"),
  ORM_REPOSITORY_DEVICE: Symbol.for("OrmRepository<DeviceModel>"),
  DATABASE_USER: Symbol.for("Database<UserModel,UserEntry>"),
  DATABASE_DEVICE: Symbol.for("Database<DeviceModel,DeviceEntry>")
};
