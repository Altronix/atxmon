import {
  Config,
  HttpConfig,
  MailerConfig,
  LinqConfig,
  DatabaseConfig,
  Environment
} from "./common/types";
import path from "path";
import yargs from "yargs";

type Mode = "development" | "production";
const modeChoices: ReadonlyArray<Mode> = ["development", "production"];
interface Args {
  rootDir?: string;
  sendgridApiKey?: string;
  database?: string;
  databaseName?: string;
  tlsCertFile?: string;
  tlsKeyFile?: string;
  httpPort?: number;
  httpsPort?: number;
  zmtpPort: (string | number)[] | undefined;
  zmtpsPort?: number;
  zmtpIpc: (string | number)[] | undefined;
  www?: string;
}

function toArray(arg: string): (string)[] {
  return arg.split(",").map(n => n);
}

function toArrayN(arg: string): number[] {
  return arg.split(",").map(n => parseInt(n));
}

function asArray(arg: (string | number)[]): string[] {
  return arg as string[];
}

function asArrayN(arg: (string | number)[]): number[] {
  return arg as number[];
}

export function root() {
  let filename =
    (require.main && require.main.filename) ||
    (process.mainModule && process.mainModule.filename);
  return filename ? path.dirname(filename) : undefined;
}

export function load(input: string[], environment: any): Config {
  let env: Environment = environment;
  let args: Args = yargs
    .options({
      rootDir: { type: "string" },
      sendGridApiKey: { type: "string" },
      database: { type: "string" },
      databaseName: { type: "string" },
      tlsCertFile: { type: "string" },
      tlsKeyFile: { type: "string" },
      httpPort: { type: "number" },
      httpsPort: { type: "number" },
      zmtpPort: { type: "array" },
      zmtpsPort: { type: "number" },
      zmtpIpc: { type: "array" },
      www: { type: "string" }
    })
    .parse(input);

  // Build HTTP config
  const http: HttpConfig = {
    certFile: args.tlsCertFile || env.TLS_CERT_FILE || "./unsafe-cert.pem",
    keyFile: args.tlsKeyFile || env.TLS_KEY_FILE || "./unsafe-key.pem",
    http: args.httpPort || parseInt(env.HTTP_PORT) || 3000,
    https: args.httpsPort || parseInt(env.HTTPS_PORT) || 3001,
    www: args.www || env.WWW || "./www"
  };

  // Build LinqConfig
  let ipc =
    (args.zmtpIpc && asArray(args.zmtpIpc)) ||
    (env.ZMTP_IPC && toArray(env.ZMTP_IPC)) ||
    [];
  let zmtp = (args.zmtpPort && asArrayN(args.zmtpPort)) ||
    (env.ZMTP_PORT && toArrayN(env.ZMTP_PORT)) || [33455];
  let zmtps = args.zmtpsPort || parseInt(env.ZMTPS_PORT) || 33456;
  const linq: LinqConfig = { ipc, zmtp, zmtps };

  // Mailer Config
  const mail: MailerConfig = {
    apiKey: args.sendgridApiKey || env.SENDGRID_API_KEY || "",
    serviceNotifications: []
  };

  // Build Database Config
  const database: DatabaseConfig = {
    name: args.databaseName || env.DATABASE_NAME || "dev-database",
    database: args.database || env.DATABASE || "./dev-database.db",
    entities:
      env.NODE_ENV && env.NODE_ENV[0].toLowerCase() === "p"
        ? [env.ATXMON_PATH + "/dist/**/*.entity.js"]
        : [env.ATXMON_PATH + "/src/**/*.entity.ts"],
    type: "sqlite"
  };

  // TODO override with CLI args
  return { database, env, http, linq, mail };
}
export default load;
