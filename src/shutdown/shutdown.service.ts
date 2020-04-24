import { SYMBOLS } from "../ioc/constants.root";
import { ShutdownManager } from "./types";
import { injectable, inject } from "inversify";

@injectable()
export class ShutdownService implements ShutdownManager {
  shutdownPromise: Promise<boolean>;
  private _resolve: any;
  private _reject: any;
  constructor() {
    this.shutdownPromise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  shutdown() {
    this._resolve(true);
  }
}
