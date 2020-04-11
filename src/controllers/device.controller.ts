import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, DeviceModel } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";

@injectable()
export class ControllerDevice implements Controller<DeviceModel> {
  utils: UtilRoutines;
  database: Database<DeviceModel>;
  constructor(
    @inject(SYMBOLS.DATABASE_DEVICE) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE) database: Database<DeviceModel>
  ) {
    this.utils = utils;
    this.database = database;
  }
}
