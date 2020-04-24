import { LinqEventHandler } from "@altronix/linq-network";
import { AltronixLinqNetworkService, LinqNetworkService } from "../ioc/types";
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

  shutdown(): void {
    return this.atx.shutdown();
  }

  registerEventHandler(eh: LinqEventHandler): LinqNetworkService {
    this.atx.registerEventHandler(eh);
    return this;
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

  on(ev: string, handler: (...args: any[]) => void): LinqNetworkService {
    this.atx.on(ev, handler);
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
