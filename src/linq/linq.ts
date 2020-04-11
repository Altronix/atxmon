import { LinqDeviceManager, DeviceManager } from "./types";
import { UtilRoutines } from "../common/types";
import { SYMBOLS } from "../ioc/constants.root";
import { inject, injectable } from "inversify";

@injectable()
export class Linq implements LinqDeviceManager {
  utils: UtilRoutines;
  manager: DeviceManager;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DEVICE_MANAGER) manager: DeviceManager
  ) {
    this.utils = utils;
    this.manager = manager;
  }
  async send<T>(
    serial: string,
    meth: "GET" | "POST" | "DELETE",
    path: string,
    data?: T
  ): Promise<any> {
    return this.manager.send(serial, meth, path, data);
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.manager.on(event, listener);
    return this;
  }

  listen(port: number): Linq;
  listen(port: string): Linq;
  listen(port: string | number): Linq {
    if (typeof port === "number") port = `tcp://*:${port}`;
    this.manager.listen(port);
    return this;
  }

  connect(port: number): Linq;
  connect(port: string): Linq;
  connect(port: string | number): Linq {
    if (typeof port === "number") port = `tcp://*:${port}`;
    this.manager.connect(port);
    return this;
  }

  async run(ms: number): Promise<any> {
    const self = this;
    this.manager.run(ms);
    let p = new Promise(resolve => self.on("ctrlc", () => resolve(true)));
    return p;
  }
}
