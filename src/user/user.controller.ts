import { Request, Response } from "express";
import { UtilRoutines, Controller } from "../common/types";
import { StandardMiddleware, IsAdmin } from "../middleware/middleware";
import { DatabaseService } from "../ioc/types";
import { UserService } from "./user.service";
import { User, UserModel, UserEntry } from "./user.model";
import { SYMBOLS } from "../ioc/constants.root";
import {
  httpGet,
  httpPost,
  httpDelete,
  controller
} from "../common/decorators";
import { injectable, inject } from "inversify";

@controller("/api/v1/users", ...StandardMiddleware, ...IsAdmin)
export class UserController implements Controller<UserModel, UserEntry> {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER)
    private database: UserService
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
        res.status(200).send({ message: "Success" });
      } else {
        res.status(403).send({ message: "User already exists" });
      }
    } catch {
      res.status(400).send({ message: "Bad request" });
    }
  }

  @httpDelete("/")
  async remove(req: Request, res: Response) {
    const email = req.query["email"];
    if (!(email && typeof email === "string")) {
      return res.status(400).send({ message: "Invalid query" });
    }

    const user = await this.database.findByEmail(email);
    if (!user) return res.status(404).send({ message: "User does not exist" });

    await this.database.remove({ email });
    return res.status(200).send({ message: "Success" });
  }

  @httpGet("/count")
  async count(req: Request, res: Response) {
    res.status(200).send({ count: await this.database.count() });
  }
}
