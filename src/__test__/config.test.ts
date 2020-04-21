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
  expect(config.http.certFile).toBe("./unsafe-development-cert.pem");
  expect(config.http.keyFile).toBe("./unsafe-development-key.pem");
  expect(config.http.http).toBe(8080);
  expect(config.http.https).toBe(8443);
  expect(config.http.www).toBe("./www");
  expect(config.database.entities).toEqual(["/foo/**/*.entity.ts"]);
  expect(config.database.name).toBe("./test.db");
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
    DATABASE_NAME: "db.db",
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
  expect(config.database.entities).toEqual(["/foo/**/*.entity.js"]);
  expect(config.database.name).toBe("db.db");
  expect(config.database.type).toBe("sqlite");
  expect(config.linq.ipc).toEqual(["./tmp", "./foo"]);
  expect(config.linq.zmtp).toEqual([1, 2, 3, 4, 5]);
  expect(config.linq.zmtps).toBe(6);
  expect(config.mail.apiKey).toBe("api-key");
  expect(config.mail.serviceNotifications).toEqual([]);
});
