import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { LoggerMiddleware } from "../middleware/logger.middleware";
import { Database, UserModel, UserEntry } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { httpGet, httpPost, controller } from "./decorators";
import { injectable, inject } from "inversify";

@controller("/users", LoggerMiddleware)
export class UserController implements Controller<UserModel, UserEntry> {
  utils: UtilRoutines;
  database: Database<UserModel, UserEntry>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) database: Database<UserModel, UserEntry>
  ) {
    this.utils = utils;
    this.database = database;
    this.index = this.index.bind(this);
  }

  @httpGet("/")
  public async index(req: Request, res: Response) {
    res.send({ users: [] });
  }
}
