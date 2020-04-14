import { METADATA_KEY, SYMBOLS } from "./ioc/constants";
import {
  HTTP_METHODS,
  ControllerConstructorTest,
  ControllerMetadata,
  ControllerMethodMetadata
} from "./types";
import { ServiceIdentifier } from "../ioc/types";
import { injectable, decorate } from "inversify";
import { Router } from "express";
import { Container } from "inversify";

// Copied from inversify-express-utils. We like decorators for initialization
// but not excessive use during runtime See inversify-express-utils performance
// issues https://github.com/inversify/inversify-express-utils/issues/1046

export function controller(
  path: string,
  ...middleware: ServiceIdentifier<any>[]
) {
  return function<T extends { new (...args: any[]): {} }>(target: T) {
    let currentMetadata: ControllerMetadata = {
      middleware: middleware,
      path: path,
      target: target
    };

    decorate(injectable(), target);
    Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

    const previousMetadata: ControllerMetadata[] =
      Reflect.getMetadata(METADATA_KEY.controller, Reflect) || [];

    const newMetadata = [currentMetadata, ...previousMetadata];

    Reflect.defineMetadata(METADATA_KEY.controller, newMetadata, Reflect);

    // console.log(Reflect.getMetadata(METADATA_KEY.controllerMethod, target));
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        let meta: ControllerMethodMetadata[] = Reflect.getMetadata(
          METADATA_KEY.controllerMethod,
          target
        );
        // Router seems to remove this binding, so we bind this in constructor
        meta.forEach(m => ((this as any)[m.key] as any).bind(this));
      }
    };
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

export function createRouter(
  container: Container,
  controller: { new (...args: any[]): {} }
) {
  let metaData: ControllerMetadata = Reflect.getMetadata(
    METADATA_KEY.controller,
    controller
  );
  let metaMethodData: ControllerMethodMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controllerMethod,
    metaData.target
  );
  const name = metaData.target.name;

  if (container.isBoundNamed(SYMBOLS.CONTROLLER, name)) {
    throw new Error(`Duplicated controller name ${name}`);
  }
  container
    .bind(SYMBOLS.CONTROLLER)
    .to(controller)
    .whenTargetNamed(name);

  // ...
  let c = container.getNamed(SYMBOLS.CONTROLLER, name) as any;

  let routes = Router();
  metaMethodData.forEach(data => {
    routes[data.method](data.path, c[data.key]);
    (c[data.key] as any).bind(c);
  });
  let ctrl = Router();
  ctrl.use(metaData.path, routes);
  return { c, ctrl };
}
