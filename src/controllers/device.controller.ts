import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { DatabaseService, DeviceModel } from "../services/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import { httpGet, httpPost, controller } from "../decorators";

@controller("/devices")
export class DeviceController implements Controller<DeviceModel> {
  utils: UtilRoutines;
  database: DatabaseService<DeviceModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE) database: DatabaseService<DeviceModel>
  ) {
    this.utils = utils;
    this.database = database;
  }

  @httpGet("/")
  private async index(req: Request, res: Response) {
    res.send({ devices: [] });
  }
}
