import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, UserModel, UserEntry } from "../database/types";
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

@controller("/users")
export class ControllerUser implements Controller<UserModel, UserEntry> {
  utils: UtilRoutines;
  database: Database<UserModel, UserEntry>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) database: Database<UserModel, UserEntry>
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
