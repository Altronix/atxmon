import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, UserModel, UserEntry } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";

@injectable()
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
}
