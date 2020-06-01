import { MiddlewareHandler, UtilRoutines } from "../common/types";
import { middleware } from "../common/decorators";
import { inject } from "inversify";
import { UserService } from "../user/user.service";
import { Request, Response, NextFunction } from "express";
import { SYMBOLS } from "../ioc/constants.root";
import { RefreshToken } from "../login/token";

@middleware()
export class ValidUserMiddleware implements MiddlewareHandler {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) private users: UserService
  ) {}

  async handler(req: Request, res: Response, next: NextFunction) {
    // Parse header
    const auth = req.headers.authorization;
    if (!auth) {
      this.utils.logger.debug("No authentication header provided!");
      return res.status(403).send({ message: "Forbidden" });
    }

    // Parse token
    const token = auth.split(" ")[1];
    if (!token) {
      this.utils.logger.debug("Token invalid");
      return res.status(403).send({ message: "Forbidden" });
    }

    // Decode and validate token
    const decoded = await this.utils.crypto
      .decodeAndValidateAccessToken<RefreshToken>(token)
      .catch(() => undefined);
    if (!decoded) {
      this.utils.logger.debug("Token decode fail");
      return res.status(403).send({ message: "Forbidden" });
    }

    // Validate user with token
    const user = await this.users.findByEmail(decoded.email);
    if (!(user && user.tokenVersion === decoded.tokenVersion)) {
      this.utils.logger.debug("Token invalid version");
      return res.status(403).send({ message: "Forbidden" });
    }

    // Assign user to context and proceed
    Object.assign(req, { user });
    next();
  }
}
