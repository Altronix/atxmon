import { injectable } from "inversify";
import {
  Config,
  DatabaseConfig,
  LinqConfig,
  Environment,
  HttpConfig,
  MailerConfig
} from "./common/types";
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
  accessTokenSecret?: string;
  refreshTokenSecret?: string;
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

export default class implements Config {
  database: DatabaseConfig;
  env: Environment;
  http: HttpConfig;
  linq: LinqConfig;
  mail: MailerConfig;
  accessTokenSecret: string;
  refreshTokenSecret: string;

  constructor(input: string[] = process.argv, environment: any = process.env) {
    let env = (this.env = environment);
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
        accessTokenSecret: { type: "string" },
        refreshTokenSecret: { type: "string" },
        www: { type: "string" }
      })
      .parse(input);

    // Build HTTP config
    this.http = {
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
    this.linq = { ipc, zmtp, zmtps };

    // Mailer Config
    this.mail = {
      apiKey: args.sendgridApiKey || env.SENDGRID_API_KEY || "",
      serviceNotifications: []
    };

    // Build Database Config
    this.database = {
      name: args.databaseName || env.DATABASE_NAME || "dev-database",
      database: args.database || env.DATABASE || "./dev-database.db",
      entities:
        env.NODE_ENV && env.NODE_ENV[0].toLowerCase() === "p"
          ? [env.ATXMON_PATH + "/dist/**/*.entity.js"]
          : [env.ATXMON_PATH + "/src/**/*.entity.ts"],
      type: "sqlite"
    };

    // Access token secrets (Note fatal error if env not set in app.ts...)
    this.accessTokenSecret =
      args.accessTokenSecret ||
      env.ACCESS_TOKEN_SECRET ||
      "invalid-access-token-secret";
    this.refreshTokenSecret =
      args.refreshTokenSecret ||
      env.REFRESH_TOKEN_SECRET ||
      "invalid-refresh-token-secret";
  }
}
