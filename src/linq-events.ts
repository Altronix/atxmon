import { DatabaseService, DeviceModel } from "./services/types";
import { UtilRoutines } from "./common/types";
import { LinqNetworkService } from "./services/types";
import { SYMBOLS } from "./ioc/constants.root";
import { inject, injectable } from "inversify";

import { LinqEventHandler, LinqAboutData } from "@altronix/linq-network";

@injectable()
export class AppEventHandler implements LinqEventHandler {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE)
    private database: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE)
    private linq: LinqNetworkService
  ) {
    this.linq.registerEventHandler(this);
  }

  onNew(serial: string, about: LinqAboutData) {}

  onHeartbeat(serial: string) {}

  onAlert(serial: string) {}

  onCtrlC() {}

  onError() {}
}
