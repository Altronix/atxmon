import { Request, Response } from "express";
import { httpGet, httpPost, controller } from "../common/decorators";
import { UtilRoutines } from "../common/types";
import { StandardMiddleware } from "../middleware/middleware";
import { UserService } from "../user/user.service";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import { Token, RefreshToken } from "../login/token";
import constants from "../login/constants";

@controller("/api/v1/logout", ...StandardMiddleware)
export class LogoutController {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER)
    private users: UserService
  ) {}

  @httpGet("/")
  @httpPost("/")
  async refresh(req: Request, res: Response) {
    const t = req.cookies[constants.REFRESH_TOKEN_ID];
    if (!t) return res.status(403).send("Forbidden");

    let decoded = await this.utils.crypto
      .decodeAndValidateRefreshToken<RefreshToken>(t)
      .catch(() => undefined);
    if (!decoded) return res.status(403).send("Forbidden");

    let user = await this.users.findById(decoded.id);
    if (!user) return res.status(403).send("Forbidden");

    if (!(user.tokenVersion === decoded.tokenVersion)) {
      return res.status(403).send("Forbidden");
    }

    let tokenVersion = user.tokenVersion + 1;
    let email = user.email;
    await this.users.update({ email }, { tokenVersion });

    res.status(200).send("Success");
  }
}
