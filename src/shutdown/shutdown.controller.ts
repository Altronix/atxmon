import { StandardMiddleware } from "../middleware/middleware";
import { httpGet, httpPost, controller } from "../common/decorators";
import { LinqNetworkService } from "../ioc/types";
import { ShutdownManager } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { Request, Response } from "express";
import { inject } from "inversify";

@controller("/shutdown", ...StandardMiddleware)
export class ShutdownController {
  constructor(
    @inject(SYMBOLS.SHUTDOWN_SERVICE) private shutdownService: ShutdownManager
  ) {}

  @httpGet("/")
  @httpPost("/")
  shutdown(req: Request, res: Response) {
    this.shutdownService.shutdown();
    res.status(200).send("Shutting down...");
  }
}
