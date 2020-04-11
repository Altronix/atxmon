export const SYMBOLS = {
  REPOSITORY_USER: Symbol.for("Repository<UserModel>"),
  REPOSITORY_DEVICE: Symbol.for("Repository<DeviceModel>"),
  DATABASE_USER: Symbol.for("Database<UserModel,UserEntry>"),
  DATABASE_DEVICE: Symbol.for("Database<DeviceModel,DeviceEntry>")
};
