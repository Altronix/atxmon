import { Request, Response, NextFunction } from "express";
import { MiddlewareHandler } from "../common/types";
import { middleware } from "../common/decorators";
import cookieParser from "cookie-parser";

let cp = cookieParser();

@middleware()
export class CookieParserMiddleware implements MiddlewareHandler {
  handler(req: Request, res: Response, next: NextFunction) {
    cp(req, res, () => next());
  }
}
