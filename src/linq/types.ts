import { Method } from "@altronix/linq-network";
export interface LinqManager {
  send<T>(serial: string, meth: Method, path: string, data?: T): Promise<any>;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  listen(port: string): LinqManager;
  connect(port: string): LinqManager;
  run(ms: number): void;
}
