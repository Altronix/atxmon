module.exports = {
  type: "sqlite",
  database: "./test.db",
  entities: [__dirname + "/src/services/orm/entities/**/*.entity.ts"]
};
