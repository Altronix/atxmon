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
    this.initializeLinq();
  }

  private initializeLinq() {
    let self = this;
    self.linq.listen("tcp://*:33248");
    self.linq.on("new", (...args: any[]) => self.onNew(...args));
    self.linq.on("heartbeat", (...args: any[]) => self.onHeartbeat(...args));
    self.linq.on("alert", (...args: any[]) => self.onAlert(...args));
    self.linq.on("ctrlc", (...args: any[]) => self.onCtrlc(...args));
    self.linq.on("error", (...args: any[]) => self.onError(...args));
    self.linq.run(50);
  }

  private async onNew(...args: any[]) {
    this.utils.logger.info(`NEW [${args[0]}] [${args[1]}]`);
  }
  private async onHeartbeat(...args: any[]) {
    this.utils.logger.info(`HEARTBEAT [${args[0]}]`);
  }
  private async onAlert(...args: any[]) {
    this.utils.logger.info(`ALERT [${args[0]}] [${args[1]}]`);
  }
  private async onCtrlc(...args: any[]) {
    this.utils.logger.warn(`CTRLC ...shutting down`);
  }
  private async onError(...args: any[]) {
    this.utils.logger.error(`ERROR [${args[0]}] [${args[1]}`);
  }

  @httpGet("/")
  private async index(req: Request, res: Response) {
    res.send(await this.database.find());
  }
}
