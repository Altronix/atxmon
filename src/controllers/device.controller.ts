import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, DeviceModel } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import * as express from "express";

export class DeviceController implements Controller<DeviceModel> {
  utils: UtilRoutines;
  database: Database<DeviceModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE) database: Database<DeviceModel>
  ) {
    this.utils = utils;
    this.database = database;
  }

  private async root(req: express.Request, res: express.Response) {
    return "{\"hello\":\"world\"}";
  }
}
