import { Request, Response, NextFunction } from "express";
import { UtilRoutines } from "../common/types";
import { Database, DeviceModel } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import { controller, httpGet, httpPost } from "./decorators";
import * as express from "express";

@controller("/")
export class RootController {
  utils: UtilRoutines;
  constructor(@inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines) {
    this.utils = utils;
  }

  @httpGet("/")
  private async index(req: Request, res: Response, next: NextFunction) {
    res.send({ root: [] });
  }
}
