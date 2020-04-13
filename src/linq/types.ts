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

export interface LinqEventHandler {
  onHeartbeat?: (serial: string) => void;
  onAlert?: (serial: string) => void;
  onCtrlc?: () => void;
  onError?: () => void;
}

export interface LinqEventHandlerMetadata {
  target: any;
}

export interface LinqEventMetadata extends LinqEventHandlerMetadata {
  event: LINQ_EVENTS;
}

// on_error (E_LINQ_ERROR e, const char *what, const char *serial)
// on_heart (const char *serial, device_s** d)
// on_alert (linq_network_alert_s* alert, linq_network_email_s* email);
// on_ctrlc ()

// node_js.on_error N/A
// node_js.on_heartbeat(serial => {});
// node_js.on_alert(objAlertNSerial => {}); // TODO should be serial, alert
