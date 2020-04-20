import { Request, Response, NextFunction } from "express";
import { MiddlewareHandler } from "../types";
import { middleware } from "../common/decorators";
import * as bodyParser from "body-parser";

let jsonParser = bodyParser.json({ limit: "15mb" });
let urlEncodedParser = bodyParser.urlencoded({ extended: true });

@middleware()
export class BodyParserMiddleware implements MiddlewareHandler {
  public handler(req: Request, res: Response, next: NextFunction) {
    jsonParser(req, res, () =>
      urlEncodedParser(req, res, () => {
        next();
      })
    );
  }
}
