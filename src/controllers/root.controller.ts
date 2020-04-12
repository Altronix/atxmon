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
  response,
  next
} from "inversify-express-utils";
import * as express from "express";

@controller("/", SYMBOLS.MIDDLEWARE_LOGGER)
export class RootController {
  utils: UtilRoutines;
  constructor(@inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines) {
    this.utils = utils;
  }

  /*
  @httpGet("/")
  private async root(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction
  ) {
    next();
  }
  */
}
