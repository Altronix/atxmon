import { Request, Response } from "express";
import { StandardMiddleware, IsAdmin } from "../middleware/middleware";
import { UtilRoutines } from "../common/types";
import { DatabaseService, LinqNetworkService, FindOpts } from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";
import { AlertModel, AlertQuery } from "./alert.model";
import { Controller } from "../common/types";
import { injectable, inject } from "inversify";
import { httpGet, httpPost, controller } from "../common/decorators";

@controller("/api/v1/alerts", ...StandardMiddleware, ...IsAdmin)
export class AlertController implements Controller<AlertModel> {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_ALERT)
    private database: DatabaseService<AlertModel>
  ) {}

  @httpGet("/")
  async index(req: Request, res: Response) {
    let opts: FindOpts<AlertModel> = {};

    // Parse URL
    let start = req.query["start"] ? req.query["start"] : false;
    let limit = req.query["limit"] ? req.query["limit"] : false;
    let sort = req.query["sort"] ? req.query["sort"] : false;
    let order = req.query["order"] ? req.query["order"] : "ASC";
    let search = await AlertQuery.valid(req.query["search"]).catch(() => false);

    if (search) Object.assign(opts, { where: search });
    if (start) Object.assign(opts, { skip: start });
    if (limit) Object.assign(opts, { take: limit });
    if (sort) Object.assign(opts, { order: { [`${sort}`]: order } });

    // Parse start,limit
    res.status(200).send(await this.database.find(opts));
  }
}
