import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import { StandardMiddleware } from "../middleware/middleware";
import { DatabaseService } from "../services/types";
import { User, UserModel, UserEntry } from "../models/user.model";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { httpGet, httpPost, controller } from "../common/decorators";
import { injectable, inject } from "inversify";

@controller("/users", ...StandardMiddleware)
export class UserController implements Controller<UserModel, UserEntry> {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER)
    private database: DatabaseService<UserModel, UserEntry>
  ) {}

  @httpGet("/")
  async index(req: Request, res: Response) {
    res.status(200).send(await this.database.find());
  }

  @httpPost("/")
  async create(req: Request, res: Response) {
    try {
      let result = await this.database.create(
        await User.fromUntrusted(req.body)
      );
      if (result) {
        this.utils.logger.info(`Create user [success]`);
        res.status(200).send("ok");
      } else {
        this.utils.logger.warn(`Create user already exists error detected`);
        res.status(403).send({ error: "User already exists" });
      }
    } catch (e) {
      this.utils.logger.warn(`Create user bad args detected [${e}]`);
      res.status(400).send({ error: "Bad request" });
    }
  }
}
