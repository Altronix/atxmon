import load, { root } from "../config";
import {
  Config,
  DatabaseConfig,
  LinqConfig,
  Environment
} from "../common/types";

test("Should load config", () => {
  let env: Environment = { ATXMON_PATH: "/foo" } as Environment;
  let config = load([], env);
  expect(config.http.certFile).toBe("./unsafe-cert.pem");
  expect(config.http.keyFile).toBe("./unsafe-key.pem");
  expect(config.http.http).toBe(3000);
  expect(config.http.https).toBe(3001);
  expect(config.http.www).toBe("./www");
  expect(config.database.entities).toEqual(["/foo/src/**/*.entity.ts"]);
  expect(config.database.database).toBe("./dev-database.db");
  expect(config.database.name).toBe("dev-database");
  expect(config.database.type).toBe("sqlite");
  expect(config.linq.ipc).toEqual([]);
  expect(config.linq.zmtp).toEqual([33455]);
  expect(config.linq.zmtps).toBe(33456);
  expect(config.mail.apiKey).toBe("");
  expect(config.mail.serviceNotifications).toEqual([]);
});

test("Should load config from enviorment", () => {
  let env: Environment = {
    NODE_ENV: "Production",
    ATXMON_PATH: "/foo",
    SENDGRID_API_KEY: "api-key",
    DATABASE_NAME: "test-database",
    DATABASE: "db.db",
    TLS_KEY_FILE: "./foo-key.pem",
    TLS_CERT_FILE: "./foo-cert.pem",
    HTTP_PORT: "1234",
    HTTPS_PORT: "123456",
    ZMTP_PORT: "1,2,3,4,5",
    ZMTP_IPC: "./tmp,./foo",
    ZMTPS_PORT: "6",
    WWW: "./test-www-path"
  };
  let config = load([], env);
  expect(config.http.certFile).toBe("./foo-cert.pem");
  expect(config.http.keyFile).toBe("./foo-key.pem");
  expect(config.http.http).toBe(1234);
  expect(config.http.https).toBe(123456);
  expect(config.http.www).toBe("./test-www-path");
  expect(config.database.entities).toEqual(["/foo/dist/**/*.entity.js"]);
  expect(config.database.database).toBe("db.db");
  expect(config.database.name).toBe("test-database");
  expect(config.database.type).toBe("sqlite");
  expect(config.linq.ipc).toEqual(["./tmp", "./foo"]);
  expect(config.linq.zmtp).toEqual([1, 2, 3, 4, 5]);
  expect(config.linq.zmtps).toBe(6);
  expect(config.mail.apiKey).toBe("api-key");
  expect(config.mail.serviceNotifications).toEqual([]);
});

test("Should load config from command line", () => {
  let env: Environment = {
    NODE_ENV: "Production",
    ATXMON_PATH: "/foo",
    SENDGRID_API_KEY: "api-key",
    DATABASE_NAME: "test-database",
    DATABASE: "db.db",
    TLS_KEY_FILE: "./foo-key.pem",
    TLS_CERT_FILE: "./foo-cert.pem",
    HTTP_PORT: "1234",
    HTTPS_PORT: "123456",
    ZMTP_PORT: "1,2,3,4,5",
    ZMTP_IPC: "./tmp,./foo",
    ZMTPS_PORT: "6",
    WWW: "./test-www-path"
  };
  const args =
    `--rootDir /boop ` +
    `--sendgridApiKey argkey ` +
    `--database thriller.db ` +
    `--databaseName thriller ` +
    `--tlsCertFile ./arg-cert.pem ` +
    `--tlsKeyFile ./arg-key.pem ` +
    `--httpPort 900 ` +
    `--httpsPort 901 ` +
    `--zmtpPort 333 444 555 666 ` +
    `--zmtpsPort 999 ` +
    `--zmtpIpc crackle jingle jam ` +
    `--www foohaha`;
  let config = load(args.split(" "), env);
  expect(config.http.certFile).toBe("./arg-cert.pem");
  expect(config.http.keyFile).toBe("./arg-key.pem");
  expect(config.http.http).toBe(900);
  expect(config.http.https).toBe(901);
  expect(config.http.www).toBe("foohaha");
  expect(config.database.entities).toEqual(["/foo/dist/**/*.entity.js"]);
  expect(config.database.database).toBe("thriller.db");
  expect(config.database.name).toBe("thriller");
  expect(config.database.type).toBe("sqlite");
  expect(config.linq.ipc).toEqual(["crackle", "jingle", "jam"]);
  expect(config.linq.zmtp).toEqual([333, 444, 555, 666]);
  expect(config.linq.zmtps).toBe(999);
  expect(config.mail.apiKey).toBe("argkey");
  expect(config.mail.serviceNotifications).toEqual([]);
});
