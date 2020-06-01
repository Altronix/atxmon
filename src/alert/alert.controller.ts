import { Request, Response } from "express";
import { StandardMiddleware, IsAdmin } from "../middleware/middleware";
import { UtilRoutines } from "../common/types";
import { DatabaseService, LinqNetworkService } from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";
import { AlertModel } from "./alert.model";
import { Controller } from "../common/types";
import { injectable, inject } from "inversify";
import { httpGet, httpPost, controller } from "../common/decorators";

@controller("/api/v1/alerts", ...StandardMiddleware, ...IsAdmin)
export class AlertController implements Controller<AlertModel> {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE)
    private database: DatabaseService<AlertModel>
  ) {}

  @httpGet("/")
  async index(req: Request, res: Response) {
    res.status(200).send(await this.database.find());
  }
}
