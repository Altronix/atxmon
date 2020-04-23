import { Request, Response } from "express";
import { httpGet, httpPost, controller } from "../common/decorators";
import { UtilRoutines } from "../common/types";
import { StandardMiddleware } from "../middleware/middleware";
import { UserService } from "../user/user.service";
import { SYMBOLS } from "../ioc/constants.root";
import { LoginModel } from "./login.model";
import { injectable, inject } from "inversify";
import { Token } from "./token";
import constants from "./constants";

@controller("/login", ...StandardMiddleware)
export class LoginController {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER)
    private users: UserService
  ) {}

  @httpPost("/")
  async login(req: Request, res: Response) {
    let login = await LoginModel.fromUntrusted(req.body);
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
      path: "/login/refresh"
    });
    res.status(200).send({ accessToken });
  }

  @httpPost("/refresh")
  async refresh(req: Request, res: Response) {
    const t = req.cookies[constants.REFRESH_TOKEN_ID];
    if (!t) return res.status(403).send("Forbidden");

    let decoded: Token | unknown = undefined;
    try {
      decoded = this.utils.crypto.decodeAndValidateRefreshToken(t);
    } catch {}
    if (!decoded) return res.status(403).send("Forbidden");

    // let user = this.users.findById(decoded.id);

    //
    // user = findById(decoded.id)
    // if(!user) return ...
    //
    // createAccessToken()
    // createRefreshToken()
    // res.cooke(...
    // send.status(200).send({accessToken});
  }

  // signout can be it's own controller to avoid url of /login/logout
  // @httpPost("/logout")
  // async logout(req: Request, res: Response) {
  //   // Simply remove cookie
  //   // res.cookie(constants.REFRESH_TOKEN_ID,"",{httpOnly:true,path:"/login/refresh"});...
  // }
}
