import { METADATA_KEY } from "./ioc/constants";
import { injectable, decorate } from "inversify";
import { LINQ_EVENTS, LinqEventMetadata } from "./types";

export function linqEvent(event: LINQ_EVENTS) {
  return function(target: any) {
    let currentMetadata: LinqEventMetadata = {
      event: event,
      target: target
    };

    decorate(injectable(), target);
    Reflect.defineMetadata(METADATA_KEY.event, currentMetadata, target);

    // We need to create an array that contains the metadata of all
    // the controllers in the application, the metadata cannot be
    // attached to a controller. It needs to be attached to a global
    // We attach metadata to the Reflect object itself to avoid
    // declaring additonal globals. Also, the Reflect is avaiable
    // in both node and web browsers.
    const previousMetadata: LinqEventMetadata[] =
      Reflect.getMetadata(METADATA_KEY.event, Reflect) || [];

    const newMetadata = [currentMetadata, ...previousMetadata];

    Reflect.defineMetadata(METADATA_KEY.event, newMetadata, Reflect);
  };
}
