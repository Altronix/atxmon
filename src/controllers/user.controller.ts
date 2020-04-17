import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { LoggerMiddleware } from "../middleware/logger.middleware";
import { DatabaseService } from "../services/types";
import { UserModel, UserEntry } from "../models/user.model";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { httpGet, httpPost, controller } from "../common/decorators";
import { injectable, inject } from "inversify";

@controller("/users", LoggerMiddleware)
export class UserController implements Controller<UserModel, UserEntry> {
  utils: UtilRoutines;
  database: DatabaseService<UserModel, UserEntry>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER)
    database: DatabaseService<UserModel, UserEntry>
  ) {
    this.utils = utils;
    this.database = database;
  }

  @httpGet("/")
  private async index(req: Request, res: Response) {
    res.send(await this.database.find());
  }

  @httpPost("/")
  private async create(req: Request, res: Response) {}
}
