import { Request, Response, NextFunction } from "express";
import { MiddlewareHandler } from "./types";
import { middleware } from "../common/decorators";
import * as bodyParser from "body-parser";

@middleware()
export class ExpectJsonMiddleware implements MiddlewareHandler {
  public handler(req: Request, res: Response, next: NextFunction) {
    req.headers["content-type"] = "application/json";
    next();
  }
}
