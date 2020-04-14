import { METADATA_KEY, SYMBOLS } from "./ioc/constants";
import {
  HTTP_METHODS,
  ControllerMetadata,
  ControllerMethodMetadata
} from "./types";
import { ServiceIdentifier } from "../ioc/types";
import { injectable, decorate } from "inversify";

// Copied from inversify-express-utils. We like decorators for initialization
// but not excessive use during runtime See inversify-express-utils performance
// issues https://github.com/inversify/inversify-express-utils/issues/1046

export function controller(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
) {
  return function(target: any) {
    let currentMetadata: ControllerMetadata = {
      middleware: middleware,
      path: path,
      target: target
    };

    decorate(injectable(), target);
    Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

    // We need to create an array that contains the metadata of all
    // the controllers in the application, the metadata cannot be
    // attached to a controller. It needs to be attached to a global
    // We attach metadata to the Reflect object itself to avoid
    // declaring additonal globals. Also, the Reflect is avaiable
    // in both node and web browsers.
    const previousMetadata: ControllerMetadata[] =
      Reflect.getMetadata(METADATA_KEY.controller, Reflect) || [];

    const newMetadata = [currentMetadata, ...previousMetadata];

    Reflect.defineMetadata(METADATA_KEY.controller, newMetadata, Reflect);
  };
}
interface HandlerDecorator {
  (target: any, key: string, value: any): void;
}

export function all(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return httpMethod("all", path, ...middleware);
}

export function httpGet(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return httpMethod("get", path, ...middleware);
}

export function httpPost(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return httpMethod("post", path, ...middleware);
}

export function httpPut(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return httpMethod("put", path, ...middleware);
}

export function httpPatch(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return httpMethod("patch", path, ...middleware);
}

export function httpHead(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return httpMethod("head", path, ...middleware);
}

export function httpDelete(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return httpMethod("delete", path, ...middleware);
}

export function httpMethod(
  method: HTTP_METHODS,
  path: string,
  ...middleware: ServiceIdentifier<any>[]
): HandlerDecorator {
  return function(target: any, key: string, value: any) {
    let metadata: ControllerMethodMetadata = {
      key,
      method,
      middleware,
      path,
      target
    };

    let metadataList: ControllerMethodMetadata[] = [];

    if (
      !Reflect.hasMetadata(METADATA_KEY.controllerMethod, target.constructor)
    ) {
      Reflect.defineMetadata(
        METADATA_KEY.controllerMethod,
        metadataList,
        target.constructor
      );
    } else {
      metadataList = Reflect.getMetadata(
        METADATA_KEY.controllerMethod,
        target.constructor
      );
    }

    metadataList.push(metadata);
  };
}
