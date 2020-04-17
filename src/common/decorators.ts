import { METADATA_KEY } from "../ioc/constants.root";
import {
  HTTP_METHODS,
  ControllerConstructorTest,
  ControllerMetadata,
  ControllerMethodMetadata
} from "../controllers/types";
import { ServiceIdentifier } from "../ioc/types";
import { Container, injectable, decorate } from "inversify";
import { Router } from "express";
import { MiddlewareHandler } from "../middleware/types";

// Copied from inversify-express-utils. We like decorators for initialization
// but not excessive use during runtime See inversify-express-utils performance
// issues https://github.com/inversify/inversify-express-utils/issues/1046

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

    class C extends target {
      constructor(...args: any[]) {
        super(...args);
        let meta: ControllerMethodMetadata[] = Reflect.getMetadata(
          METADATA_KEY.controllerMethod,
          target
        );
        // Router seems to remove this binding, so we bind this in constructor
        meta.forEach(m => {
          (this as any)[m.key] = ((this as any)[m.key] as any).bind(this);
        });
      }
    }
    decorate(injectable(), C);
    return C;
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

export function getControllerMiddleware(controller: any) {
  let metaData: ControllerMetadata = Reflect.getMetadata(
    METADATA_KEY.controller,
    controller.constructor
  );
  return metaData.middleware;
}

export function createRouter(
  controller: any,
  ...middleware: MiddlewareHandler[]
) {
  let metaData: ControllerMetadata = Reflect.getMetadata(
    METADATA_KEY.controller,
    controller.constructor
  );
  let metaMethodData: ControllerMethodMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controllerMethod,
    controller.constructor
  );

  let routes = Router();
  metaMethodData.forEach(data => {
    routes[data.method](data.path, controller[data.key]);
  });
  let root = Router();
  middleware.forEach(m => root.use(m.handler));
  root.use(metaData.path, routes);
  return root;
}
