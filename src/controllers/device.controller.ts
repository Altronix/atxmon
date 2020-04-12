import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, DeviceModel } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import {
  controller,
  httpGet,
  request,
  response
} from "inversify-express-utils";
import * as express from "express";

@controller("/devices")
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

  @httpGet("/")
  private async root(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    return "{\"hello\":\"world\"}";
  }
}
