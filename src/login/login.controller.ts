import { Request, Response } from "express";
import { httpGet, httpPost, controller } from "../common/decorators";
import { UtilRoutines } from "../common/types";
import { StandardMiddleware } from "../middleware/middleware";
import { UserService } from "../user/user.service";
import { SYMBOLS } from "../ioc/constants.root";
import { LoginModel } from "./login.model";
import { injectable, inject } from "inversify";

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
    let token = { role: user.role, email: user.email };
    let accessToken = await this.utils.crypto.createAccessToken(token);
    let refreshToken = await this.utils.crypto.createRefreshToken(token);
    res.cookie("mondle", refreshToken, {
      httpOnly: true,
      path: "/login/refresh"
    });
    res.status(200).send({ accessToken });
  }

  @httpPost("/refresh")
  async refresh(req: Request, res: Response) {
    // TODO - parse cookie, if valid send new access token
    // token = req.cookies.mondle
    // if(!token) return ....
    //
    // let decoded = decodeAndValidate(token)
    // if(!decoded) return ...
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
  //   // res.cookie("mondle","",{httpOnly:true,path:"/login/refresh"});...
  // }
}
