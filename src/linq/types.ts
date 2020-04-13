import { Method } from "@altronix/linq-network";
import { UtilRoutines } from "../common/types";

export type LINQ_EVENTS = "heartbeat" | "alert" | "error" | "new" | "ctrlc";
export interface DeviceManager {
  send<T>(serial: string, meth: Method, path: string, data?: T): Promise<any>;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  listen(port: string): DeviceManager;
  connect(port: string): DeviceManager;
  run(ms: number): void;
}

export interface LinqDeviceManager {
  utils: UtilRoutines;
  manager: DeviceManager;
  send<T>(serial: string, meth: Method, path: string, data?: T): Promise<any>;
  on(e: string | symbol, l: (...args: any[]) => void): LinqDeviceManager;
  listen(port: string | number): LinqDeviceManager;
  connect(port: string | number): LinqDeviceManager;
  run(ms: number): Promise<any>;
}

export interface LinqEventMetadata {
  event: LINQ_EVENTS;
  target: any;
}
