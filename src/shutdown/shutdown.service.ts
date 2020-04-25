import { SYMBOLS } from "../ioc/constants.root";
import { ShutdownManager } from "./types";
import { LinqNetworkService } from "../ioc/types";
import { injectable, inject, decorate } from "inversify";
import * as Events from "events";

decorate(injectable(), Events.EventEmitter);

@injectable()
export class ShutdownService extends Events.EventEmitter
  implements ShutdownManager {
  shutdownPromise: Promise<boolean>;
  private _resolve: any;
  private _reject: any;
  constructor() {
    super();
    this.shutdownPromise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  shutdown() {
    this.emit("shutdown");
    this._resolve(true);
  }
}
