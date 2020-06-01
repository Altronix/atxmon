import { MiddlewareHandler, UtilRoutines } from "../common/types";
import { middleware } from "../common/decorators";
import { inject } from "inversify";
import { UserService } from "../user/user.service";
import { User } from "../user/user.model";
import { Request, Response, NextFunction } from "express";
import { SYMBOLS } from "../ioc/constants.root";
import { RefreshToken } from "../login/token";

@middleware()
export class IsAdminMiddleware implements MiddlewareHandler {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_USER) private users: UserService
  ) {}

  async handler(req: Request, res: Response, next: NextFunction) {
    let { user } = (req as any) as { user: User };
    if (!(user.role === 0)) {
      return res.status(403).send({ message: "Forbidden" });
    }
    next();
  }
}
