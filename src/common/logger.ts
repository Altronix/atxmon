import { LOG_CHANNELS, LoggerRoutines } from "./types";
import { injectable } from "inversify";

const RESET: string = "\x1b[0m";
const BOLD: string = "\x1b[1m";
const BOLD_OFF: string = "\x1b[21m";
const BLINK: string = "\x1b[5m";
const BLINK_OFF: string = "\x1b[25m";
const UNDERLINE: string = "\x1b[4m";
const UNDERLINE_OFF: string = "\x1b[24m";

const BLACK: string = "\x1b[30m";
const RED: string = "\x1b[31m";
const GREEN: string = "\x1b[32m";
const YELLOW: string = "\x1b[33m";
const BLUE: string = "\x1b[34m";
const MAGENTA: string = "\x1b[35m";
const CYAN: string = "\x1b[36m";
const WHITE: string = "\x1b[37m";
const DEFAULT: string = "\x1b[39m";
const GRAY: string = "\x1b[90m";
const LIGHT_RED: string = "\x1b[91m";
const LIGHT_GREEN: string = "\x1b[92m";
const LIGHT_YELLOW: string = "\x1b[93m";
const LIGHT_BLUE: string = "\x1b[94m";
const LIGHT_MAGENTA: string = "\x1b[95m";
const LIGHT_CYAN: string = "\x1b[96m";
const LIGHT_WHITE: string = "\x1b[97m";

const BACKGROUND_BLACK: string = "\x1b[40m";
const BACKGROUND_RED: string = "\x1b[41m";
const BACKGROUND_GREEN: string = "\x1b[42m";
const BACKGROUND_YELLOW: string = "\x1b[43m";
const BACKGROUND_BLUE: string = "\x1b[44m";
const BACKGROUND_MAGENTA: string = "\x1b[45m";
const BACKGROUND_CYAN: string = "\x1b[46m";
const BACKGROUND_WHITE: string = "\x1b[47m";
const BACKGROUND_DEFAULT: string = "\x1b[49m";
const BACKGROUND_LIGHT_GRAY: string = "\x1b[100m";
const BACKGROUND_LIGHT_RED: string = "\x1b[101m";
const BACKGROUND_LIGHT_GREEN: string = "\x1b[102m";
const BACKGROUND_LIGHT_YELLOW: string = "\x1b[103m";
const BACKGROUND_LIGHT_BLUE: string = "\x1b[104m";
const BACKGROUND_LIGHT_MAGENTA: string = "\x1b[105m";
const BACKGROUND_LIGHT_CYAN: string = "\x1b[106m";
const BACKGROUND_LIGHT_WHITE: string = "\x1b[107m";

const colorMap = {
  trace: `${LIGHT_BLUE}`,
  debug: `${CYAN}`,
  info: `${GREEN}`,
  warn: `${YELLOW}`,
  error: `${RED}`,
  fatal: `${MAGENTA}`
};

@injectable()
export class Logger implements LoggerRoutines {
  log(channel: LOG_CHANNELS, message: string) {
    const now = `${CYAN}${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    const arrow = `${WHITE}=>`;
    const level = `${colorMap[channel]}${channel.slice(-5).toUpperCase()}`;
    const m = `${LIGHT_BLUE}${message}${RESET}`;
    console.log(`${now} ${arrow} ${level} ${m}`);
  }
  trace(message: string): void {
    this.log("trace", message);
  }
  debug(message: string): void {
    this.log("debug", message);
  }
  info(message: string): void {
    this.log("info", message);
  }
  warn(message: string): void {
    this.log("warn", message);
  }
  error(message: string): void {
    this.log("error", message);
  }
  fatal(message: string, code: number): void {
    this.log("fatal", message);
    process.exit(code);
  }
}

export default function log(channel: LOG_CHANNELS, message: string) {
  const now = `${CYAN}${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  const arrow = `${WHITE}=>`;
  const level = `${colorMap[channel]}${channel.slice(-5).toUpperCase()}`;
  const m = `${LIGHT_BLUE}${message}${RESET}`;
  console.log(`${now} ${arrow} ${level} ${m}`);
}
