import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { LoggerMiddleware } from "../middleware/logger.middleware";
import { DatabaseService } from "../services/types";
import { User, UserModel, UserEntry } from "../models/user.model";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { httpGet, httpPost, controller } from "../common/decorators";
import { injectable, inject } from "inversify";

@controller("/users", LoggerMiddleware)
export class UserController implements Controller<UserModel, UserEntry> {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER)
    private database: DatabaseService<UserModel, UserEntry>
  ) {}

  @httpGet("/")
  private async index(req: Request, res: Response) {
    res.send(await this.database.find());
  }

  @httpPost("/")
  private async create(req: Request, res: Response) {
    try {
      let user = await User.fromUntrusted(req.body);
      let exists = await this.database.find({ name: user.name });
      if (exists.length) res.status(400).send({ error: "exists" });
      let result = await this.database.create(user);
    } catch {
    }
  }
}
