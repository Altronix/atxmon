import { injectable, decorate } from "inversify";
export function middleware() {
  return function<T extends { new (...args: any[]): {} }>(target: T) {
    decorate(injectable(), target);
    class C extends target {
      constructor(...args: any[]) {
        super(...args);
        (this as any).handler = ((this as any).handler as any).bind(this);
      }
    }
    decorate(injectable(), C);
    return C;
  };
}
