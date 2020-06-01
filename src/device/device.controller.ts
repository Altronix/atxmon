import { Request, Response } from "express";
import { StandardMiddleware, IsAdmin } from "../middleware/middleware";
import { UtilRoutines } from "../common/types";
import { DeviceExistsMiddleware } from "../middleware/device-exists.middleware";
import { DatabaseService, LinqNetworkService, FindOpts } from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";
import { DeviceModel, DeviceQuery } from "./device.model";
import { Controller } from "../common/types";
import { injectable, inject } from "inversify";
import { httpGet, httpPost, controller } from "../common/decorators";

@controller("/api/v1/devices", ...StandardMiddleware, ...IsAdmin)
export class DeviceController implements Controller<DeviceModel> {
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES)
    private utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE)
    private database: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE)
    private linq: LinqNetworkService
  ) {}

  @httpGet("/")
  async index(req: Request, res: Response) {
    let opts: FindOpts<DeviceModel> = {};

    // Parse URL
    let start = req.query["start"] ? req.query["start"] : false;
    let limit = req.query["limit"] ? req.query["limit"] : false;
    let sort = req.query["sort"] ? req.query["sort"] : false;
    let order = req.query["order"] ? req.query["order"] : "ASC";
    let search = await DeviceQuery.valid(req.query["search"]).catch(
      () => false
    );

    if (search) Object.assign(opts, { where: search });
    if (start) Object.assign(opts, { skip: start });
    if (limit) Object.assign(opts, { take: limit });
    if (sort) Object.assign(opts, { order: { [`${sort}`]: order } });

    // Parse start,limit
    res.status(200).send(await this.database.find(opts));
  }

  @httpGet("/count")
  async count(req: Request, res: Response) {
    res.status(200).send({ count: await this.database.count() });
  }
}
