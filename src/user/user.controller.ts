import { Request, Response } from "express";
import { UtilRoutines, Controller } from "../common/types";
import { StandardMiddleware } from "../middleware/middleware";
import { DatabaseService } from "../ioc/types";
import { User, UserModel, UserEntry } from "./user.model";
import { SYMBOLS } from "../ioc/constants.root";
import { httpGet, httpPost, controller } from "../common/decorators";
import { injectable, inject } from "inversify";

@controller("/api/v1/users", ...StandardMiddleware)
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
      let user, result;
      if (
        (user = await User.fromUntrustedThrowable(req.body)) &&
        (result = await this.database.create(user))
      ) {
        res.status(200).send("Success");
      } else {
        res.status(403).send("User already exists");
      }
    } catch {
      res.status(400).send("Bad request");
    }
  }
}
