import { METADATA_KEY } from "../ioc/constants.root";
import {
  HTTP_METHODS,
  ControllerMetadata,
  ControllerMetadataResolved,
  MethodMetadata,
  MethodMetadataResolved,
  MiddlewareHandler
} from "./types";
import { ServiceIdentifier } from "../ioc/types";
import { Container, injectable, decorate } from "inversify";
import { Router } from "express";

// Copied from inversify-express-utils. We like decorators for initialization
// but not excessive use during runtime See inversify-express-utils performance
// issues https://github.com/inversify/inversify-express-utils/issues/1046

export interface MiddlewareMetadata {
  target: any;
}

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

    const prev: MiddlewareMetadata[] =
      Reflect.getMetadata(METADATA_KEY.middlware, Reflect) || [];
    const meta: MiddlewareMetadata[] = [{ target: C }, ...prev];
    Reflect.defineMetadata(METADATA_KEY.middlware, meta, Reflect);
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
        let meta: MethodMetadata[] = Reflect.getMetadata(
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
    let metadata: MethodMetadata = {
      key,
      method,
      middleware,
      path,
      target
    };

    let metadataList: MethodMetadata[] = [];

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

export interface ControllerMiddlewareMetadata {
  controller: ControllerMetadata;
  methods: { [key: string]: MethodMetadata };
}

export interface Middleware {
  controller: ControllerMetadataResolved;
  methods: { [key: string]: MethodMetadataResolved };
}

export function getControllerMiddlewareMetadata(
  controller: any
): ControllerMiddlewareMetadata {
  let meta: ControllerMetadata = Reflect.getMetadata(
    METADATA_KEY.controller,
    controller.constructor
  );
  let methodMeta: MethodMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controllerMethod,
    controller.constructor
  );
  let ret: ControllerMiddlewareMetadata = {
    controller: meta,
    methods: {}
  };
  methodMeta.forEach(m => (ret.methods[m.key] = m));
  return ret;
}

export function getControllerMiddleware(
  c: Container,
  service: ControllerMiddlewareMetadata
): Middleware {
  let controller = Object.assign({}, service.controller, {
    middleware: service.controller.middleware.map(i =>
      c.get<MiddlewareHandler>(i)
    )
  });
  let methods: { [key: string]: MethodMetadataResolved } = {};
  Object.keys(service.methods).forEach(key => {
    methods[key] = Object.assign({}, service.methods[key], {
      middleware: service.methods[key].middleware.map(i =>
        c.get<MiddlewareHandler>(i)
      )
    });
  });
  return { controller, methods };
}

export function loadMiddleware(container: Container) {
  const meta: MiddlewareMetadata[] =
    Reflect.getMetadata(METADATA_KEY.middlware, Reflect) || [];
  meta.forEach(m => container.bind(m.target).toSelf());
}

export function createRouter(container: Container, controller: any) {
  let meta = getControllerMiddlewareMetadata(controller);
  let middleware = getControllerMiddleware(container, meta);

  // Add method route and route middleware
  let routes = Router();
  Object.keys(middleware.methods).forEach(fn => {
    let meta = middleware.methods[fn];
    meta.middleware.forEach(middleware => {
      routes[meta.method](meta.path, middleware.handler);
    });
    routes[meta.method](meta.path, controller[fn]);
  });

  // Add controller middleware
  let root = Router();
  middleware.controller.middleware.forEach(m =>
    root.use(middleware.controller.path, m.handler)
  );
  root.use(middleware.controller.path, routes);
  return root;
}
