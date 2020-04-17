import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { DeviceExistsMiddleware } from "../middleware/device-exists.middleware";
import {
  DatabaseService,
  DeviceModel,
  LinqNetworkService
} from "../services/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import { httpGet, httpPost, controller } from "../common/decorators";

@controller("/devices")
export class DeviceController implements Controller<DeviceModel> {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE)
    private database: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE)
    private linq: LinqNetworkService
  ) {}

  @httpGet("/")
  private async index(req: Request, res: Response) {
    res.send(await this.database.find());
  }

  @httpGet("/:id", DeviceExistsMiddleware)
  private async id(req: Request, res: Response) {
    this.utils.logger.trace("Device ID Request");
  }
}
