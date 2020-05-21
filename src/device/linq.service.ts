import { LinqEventHandler } from "@altronix/linq-network";
import { AltronixLinqNetworkService, LinqNetworkService } from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";
import { injectable, inject } from "inversify";
import { Subject } from "rxjs";

interface AboutData {
  siteId: string;
  prjVersion: string;
  productKey: string;
  product: string;
  mqxVersion: string;
  atxVersion: string;
  sslVersion: string;
  webVersion: string;
  mfg: string;
  user: string;
  mac: string;
  sid: string;
}

interface AlertData {
  who: string;
  what: string;
  where: string;
  when: Date;
  mesg: string;
  serial: string;
  from: string;
  subject: string;
  user: string;
  password: string;
  server: string;
  port: number;
}

type EVENTS = "new" | "heartbeat" | "alert" | "error" | "ctrlc";
export type Events =
  | NewEvent
  | HeartbeatEvent
  | AlertEvent
  | ErrorEvent
  | CtrlcEvent;

interface Event {
  type: EVENTS;
}

interface NewEvent extends AboutData {
  type: "new";
}

interface HeartbeatEvent {
  type: "heartbeat";
  serial: string;
}

interface AlertEvent extends AlertData {
  type: "alert";
}

interface ErrorEvent {
  type: "error";
  serial: string;
  errorCode: number;
  errorMessage: string;
}

interface CtrlcEvent {
  type: "ctrlc";
}

type FromNode<Event> = Omit<Event, "type">;

@injectable()
export class LinqService implements LinqNetworkService {
  events$: Subject<Events> = new Subject<Events>();
  constructor(
    @inject(SYMBOLS.ATX_LINQ_SERVICE) private atx: AltronixLinqNetworkService
  ) {}

  init(): LinqNetworkService {
    this.atx
      .on("new", (id: string, ev: FromNode<NewEvent>) => {
        this.events$.next({ type: "new", ...ev });
      })
      .on("heartbeat", (serial: string) => {
        this.events$.next({ type: "heartbeat", serial });
      })
      .on("alert", (ev: FromNode<AlertEvent>) => {
        this.events$.next({ type: "alert", ...ev });
      })
      .on("error", (ev: FromNode<ErrorEvent>) => {
        this.events$.next({ type: "error", ...ev });
      })
      .on("ctrlc", (ev: FromNode<CtrlcEvent>) => {
        this.events$.next({ type: "ctrlc", ...ev });
      });
    return this;
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
