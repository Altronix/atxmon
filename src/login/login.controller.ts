import { Request, Response } from "express";
import { httpGet, httpPost, controller } from "../common/decorators";
import { UtilRoutines } from "../common/types";
import { StandardMiddleware } from "../middleware/middleware";
import { UserService } from "../user/user.service";
import { SYMBOLS } from "../ioc/constants.root";
import { LoginModel } from "./login.model";
import { injectable, inject } from "inversify";
import { Token, RefreshToken } from "./token";
import constants from "./constants";

@controller("/api/v1/login", ...StandardMiddleware)
export class LoginController {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER)
    private users: UserService
  ) {}

  @httpPost("/")
  async login(req: Request, res: Response) {
    let login = await LoginModel.fromUntrusted(req.body).catch(() => undefined);
    if (!login) return res.status(403).send("Forbidden");

    let user = await this.users.findByEmail(login.email);
    if (!user) return res.status(403).send("Forbidden");

    let valid = await this.utils.crypto.validate(login.password, user.hash);
    if (!valid) return res.status(403).send("Forbidden");

    // Send tokens // TODO add iat etc
    let token: Token = { id: user.id, role: user.role, email: user.email };
    let accessToken = await this.utils.crypto.createAccessToken(token);
    let refreshToken = await this.utils.crypto.createRefreshToken(token);
    res.cookie(constants.REFRESH_TOKEN_ID, refreshToken, {
      httpOnly: true,
      path: "/api/v1/login/refresh"
    });
    delete user.hash;
    res.status(200).send({ accessToken, user });
  }

  @httpGet("/refresh")
  @httpPost("/refresh")
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

    let token: RefreshToken = {
      id: user.id,
      role: user.role,
      email: user.email,
      tokenVersion: user.tokenVersion
    };
    let accessToken = await this.utils.crypto.createAccessToken(token);
    let refreshToken = await this.utils.crypto.createRefreshToken(token);

    res.cookie(constants.REFRESH_TOKEN_ID, refreshToken, {
      httpOnly: true,
      path: "/api/v1/login/refresh"
    });
    delete user.hash;
    res.status(200).send({ accessToken, user });
  }
}
