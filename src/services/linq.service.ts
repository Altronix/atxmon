import { AltronixLinqNetworkService, LinqNetworkService } from "./types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";

@injectable()
export class LinqService implements LinqNetworkService {
  atx: AltronixLinqNetworkService;
  constructor(
    @inject(SYMBOLS.ATX_LINQ_SERVICE) atx: AltronixLinqNetworkService
  ) {
    this.atx = atx;
  }

  version(): string {
    return this.atx.version();
  }

  listen(arg: string | number): LinqService {
    this.atx.listen(arg);
    return this;
  }

  connect(arg: string | number): LinqService {
    this.atx.connect(arg);
    return this;
  }

  close(arg: number): LinqService {
    this.atx.close(arg);
    return this;
  }

  send<T>(
    serial: string,
    meth: "GET" | "POST" | "DELETE",
    path: string,
    data?: T
  ): Promise<any> {
    if (data) {
      return this.atx.send(serial, meth, path, data);
    } else {
      return this.atx.send(serial, meth, path);
    }
  }

  deviceCount(): number {
    return this.atx.deviceCount();
  }

  nodeCount(): number {
    return this.atx.nodeCount();
  }

  run(ms: number): Promise<any> {
    return this.atx.run(ms);
  }
}
