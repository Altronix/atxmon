import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, UserModel, UserEntry } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import * as express from "express";

export class UserController implements Controller<UserModel, UserEntry> {
  utils: UtilRoutines;
  database: Database<UserModel, UserEntry>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) database: Database<UserModel, UserEntry>
  ) {
    this.utils = utils;
    this.database = database;
  }

  private async root(req: express.Request, res: express.Response) {
    return "{\"hello\":\"world\"}";
  }
}
