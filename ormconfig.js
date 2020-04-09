module.exports = {
  type: "sqlite",
  database: "./test.db",
  entities: [__dirname + "/src/database/orm/entities/**/*.entity.ts"]
};
