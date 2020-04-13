import { Database, DeviceModel } from "./database/types";
import { UtilRoutines } from "./common/types";
import { LinqEventHandler } from "./linq/types";
import { EventHandler, event } from "./linq/decorators";
import { SYMBOLS } from "./ioc/constants.root";
import { inject, injectable } from "inversify";

@EventHandler()
export class AppEventHandler implements LinqEventHandler {
  utils: UtilRoutines;
  database: Database<DeviceModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE) database: Database<DeviceModel>
  ) {
    this.utils = utils;
    this.database = database;
  }

  onHeartbeat(serial: string) {}

  onAlert(serial: string) {}

  onCtrlC() {}

  onError() {}
}
