import { METADATA_KEY } from "./ioc/constants";
import { injectable, decorate } from "inversify";
import {
  LINQ_EVENTS,
  LinqEventMetadata,
  LinqEventHandlerMetadata
} from "./types";

/**
 * @brief https://github.com/inversify/inversify-express-utils/src/decorators.ts
 * (Copied ideas from @conroller)
 */
export function EventHandler() {
  return function(target: any) {
    let currentMetadata: LinqEventHandlerMetadata = {
      target: target
    };

    decorate(injectable(), target);
    Reflect.defineMetadata(METADATA_KEY.eventHandler, currentMetadata, target);

    const previousMetadata: LinqEventHandlerMetadata[] =
      Reflect.getMetadata(METADATA_KEY.eventHandler, Reflect) || [];

    const newMetadata = [currentMetadata, ...previousMetadata];

    Reflect.defineMetadata(METADATA_KEY.eventHandler, newMetadata, Reflect);
  };
}

export function event(ev: LINQ_EVENTS) {
  return function(target: any, key: any, value: any) {
    let metadata: LinqEventMetadata = {
      event: ev,
      target
    };

    let metadataList: LinqEventMetadata[] = [];

    if (!Reflect.hasMetadata(METADATA_KEY.event, target.constructor)) {
      Reflect.defineMetadata(
        METADATA_KEY.event,
        metadataList,
        target.constructor
      );
    } else {
      metadataList = Reflect.getMetadata(
        METADATA_KEY.event,
        target.constructor
      );
    }

    metadataList.push(metadata);
  };
}
