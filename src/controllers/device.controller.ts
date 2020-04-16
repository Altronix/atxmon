import { Request, Response } from "express";
import { UtilRoutines } from "../common/types";
import {
  DatabaseService,
  DeviceModel,
  LinqNetworkService
} from "../services/types";
import { Controller } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import { httpGet, httpPost, controller } from "../decorators";

@controller("/devices")
export class DeviceController implements Controller<DeviceModel> {
  utils: UtilRoutines;
  database: DatabaseService<DeviceModel>;
  linq: LinqNetworkService;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.DATABASE_DEVICE) database: DatabaseService<DeviceModel>,
    @inject(SYMBOLS.LINQ_SERVICE) linq: LinqNetworkService
  ) {
    this.utils = utils;
    this.database = database;
    this.linq = linq;
  }

  @httpGet("/")
  private async index(req: Request, res: Response) {
    res.send({ devices: [] });
  }
}
