import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { Database, UserModel, UserEntry } from "../database/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import * as express from "express";
import { httpGet, httpPost, controller } from "./decorators";

@controller("/users")
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
  public async index(req: express.Request, res: express.Response) {
    res.send({ users: [] });
  }
}
