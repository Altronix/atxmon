import { METADATA_KEY } from "./ioc/constants";
import { injectable, decorate } from "inversify";
import { LINQ_EVENTS, LinqEventMetadata } from "./types";

export function linqEvent(event: LINQ_EVENTS) {
  return function(target: any) {
    decorate(injectable(), target);
    let metadata: LinqEventMetadata = {
      event,
      target
    };
    Reflect.defineMetadata(METADATA_KEY.event, metadata, target);
  };
}
