import {
  Config,
  HttpConfig,
  MailerConfig,
  LinqConfig,
  DatabaseConfig,
  Environment
} from "./common/types";
import path from "path";

function stringToArray(arg: string): (string)[] {
  return arg.split(",").map(n => n);
}

function stringToArrayNumber(arg: string): number[] {
  return arg.split(",").map(n => parseInt(n));
}

export function root() {
  let filename =
    (require.main && require.main.filename) ||
    (process.mainModule && process.mainModule.filename);
  return filename ? path.dirname(filename) : undefined;
}

export function load(args: string[], environment: any): Config {
  let env: Environment = environment;

  // Build HTTP config
  const http: HttpConfig = {
    certFile: env.TLS_CERT_FILE || "./unsafe-development-cert.pem",
    keyFile: env.TLS_KEY_FILE || "./unsafe-development-key.pem",
    http: parseInt(env.HTTP_PORT) || 8080,
    https: parseInt(env.HTTPS_PORT) || 8443,
    www: env.WWW || "./www"
  };

  // Build LinqConfig
  const linq: LinqConfig = {
    ipc: env.ZMTP_IPC ? stringToArray(env.ZMTP_IPC) : [],
    zmtp: env.ZMTP_PORT ? stringToArrayNumber(env.ZMTP_PORT) : [33455],
    zmtps: parseInt(env.ZMTPS_PORT) || 33456
  };

  // Mailer Config
  const mail: MailerConfig = {
    apiKey: env.SENDGRID_API_KEY || "",
    serviceNotifications: []
  };

  // Build Database Config
  const database: DatabaseConfig = {
    name: env.DATABASE_NAME || "./test.db",
    entities:
      env.NODE_ENV && env.NODE_ENV[0].toLowerCase() === "p"
        ? [env.ATXMON_PATH + "/**/*.entity.js"]
        : [env.ATXMON_PATH + "/**/*.entity.ts"],
    type: "sqlite"
  };

  // TODO override with CLI args
  return { database, env, http, linq, mail };
}
export default load;
