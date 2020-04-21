import load from "../config";
import { Config, Environment } from "../common/types";

test("Should load config", () => {
  let env: Environment = {} as Environment;
  let config = load([], env);
  expect(config.http.certFile).toBe("./unsafe-development-cert.pem");
  expect(config.http.keyFile).toBe("./unsafe-development-key.pem");
  expect(config.http.http).toBe(8080);
  expect(config.http.https).toBe(8443);
  expect(config.http.www).toBe("./www");
  // expect(config.database.entities).toBe([__dirname + "/src/**/*.entity.ts"]);
  expect(config.database.name).toBe("./test.db");
  expect(config.database.type).toBe("sqlite");
  expect(config.linq.ipc).toEqual([]);
  expect(config.linq.zmtp).toEqual([33455]);
  expect(config.linq.zmtps).toBe(33456);
  expect(config.mail.apiKey).toBe("");

  expect(config.mail.serviceNotifications).toEqual([]);
});
