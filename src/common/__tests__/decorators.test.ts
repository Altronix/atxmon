import {
  controller,
  middleware,
  httpGet,
  httpPost,
  createRouter,
  getControllerMiddlewareMetadata,
  getControllerMiddleware,
  ControllerMiddlewareMetadata,
  AppRoutines,
  AppAnd,
  AppConstructorAnd,
  App
} from "../decorators";
import { ControllerMetadata, MethodMetadata } from "../types";
import { Newable } from "../../ioc/types";
import { METADATA_KEY } from "../../ioc/constants.root";
import { MiddlewareHandler } from "../types";
import { Request, Response, NextFunction, Router } from "express";
import { Container } from "inversify";

test("app should bind controllers and extend class", () => {
  @controller("/hello")
  class ControllerA {
    @httpGet("/")
    index(req: Request, res: Response) {}
  }

  @App({ controllers: [ControllerA] })
  class Foo {
    app: any = { use: jest.fn() };
    hello(): string {
      return "hello";
    }
  }
  let container = new Container();
  container.bind<AppAnd<Foo>>(Foo as AppConstructorAnd<Foo>).toSelf();
  let foo = container.get<AppAnd<Foo>>(Foo as AppConstructorAnd<Foo>);
  expect(foo.load).toBeDefined();
  expect(foo.hello()).toBe("hello");
  foo.load(container);
  expect(container.get<ControllerA>(ControllerA)).toBeTruthy();
});

test("Controller should add metadata", () => {
  @controller("/users")
  class ControllerA {
    @httpGet("/")
    index(req: Request, res: Response) {}
  }

  @controller("/devices")
  class ControllerB {
    @httpPost("/")
    index(req: Request, res: Response) {}
  }

  let meta: ControllerMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controller,
    Reflect
  );

  let metaMethodsA: MethodMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controllerMethod,
    ControllerA
  );

  let metaMethodsB: MethodMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controllerMethod,
    ControllerB
  );

  expect(meta[0].target.name).toEqual("ControllerB");
  expect(meta[0].path).toEqual("/devices");
  expect(meta[0].middleware.length).toEqual(0);
  expect(metaMethodsB[0].middleware.length).toEqual(0);
  expect(metaMethodsB[0].path).toEqual("/");
  expect(metaMethodsB[0].key).toEqual("index");
  expect(metaMethodsB[0].method).toEqual("post");

  expect(meta[1].target.name).toEqual("ControllerA");
  expect(meta[1].path).toEqual("/users");
  expect(meta[1].middleware.length).toEqual(0);
  expect(metaMethodsA[0].middleware.length).toEqual(0);
  expect(metaMethodsA[0].path).toEqual("/");
  expect(metaMethodsA[0].key).toEqual("index");
  expect(metaMethodsA[0].method).toEqual("get");
});

test("Controller metadata should be available on constructor", () => {
  @controller("/foo")
  class Foo {
    @httpGet("/")
    index() {}
  }
  let f = new Foo();
  let meta: ControllerMetadata = Reflect.getMetadata(
    METADATA_KEY.controller,
    f.constructor
  );
  let metaMethods: MethodMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controllerMethod,
    f.constructor
  );
  expect(meta.middleware.length).toEqual(0);
  expect(meta.path).toEqual("/foo");
  expect(meta.target.name).toEqual("Foo");
  expect(metaMethods[0].method).toEqual("get");
  expect(metaMethods[0].key).toEqual("index");
  expect(metaMethods[0].path).toEqual("/");
  expect(metaMethods[0].middleware.length).toEqual(0);
});

test("Controller should add", () => {
  @controller("/users")
  class ControllerA {
    @httpGet("/")
    index(req: Request, res: Response) {
      console.log(this);
    }
  }
});

test("Get controller middleware metadta", () => {
  @middleware()
  class MiddlewareA implements MiddlewareHandler {
    name: string = "MiddlewareA";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @middleware()
  class MiddlewareB implements MiddlewareHandler {
    name: string = "MiddlewareB";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @middleware()
  class MiddlewareC implements MiddlewareHandler {
    name: string = "MiddlewareC";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @middleware()
  class MiddlewareD implements MiddlewareHandler {
    name: string = "MiddlewareD";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @controller("/foo", MiddlewareA, MiddlewareB)
  class ControllerA {
    @httpGet("/", MiddlewareC) getIndex(req: Request, res: Response) {}
    @httpGet("/:id", MiddlewareD) postId(req: Request, res: Response) {}
  }
  let c = new ControllerA();
  let m = getControllerMiddlewareMetadata(c);
  expect(m.controller.middleware.length).toEqual(2);
  expect(m.methods["getIndex"]).toBeTruthy();
  expect(m.methods["postId"]).toBeTruthy();
  let ca = new (m.controller.middleware[0] as Newable<MiddlewareA>)();
  let cb = new (m.controller.middleware[1] as Newable<MiddlewareB>)();
  let ma = new (m.methods["getIndex"].middleware[0] as Newable<MiddlewareC>)();
  let mb = new (m.methods["postId"].middleware[0] as Newable<MiddlewareD>)();
  expect(ca.name).toEqual("MiddlewareA");
  expect(cb.name).toEqual("MiddlewareB");
  expect(ma.name).toEqual("MiddlewareC");
  expect(mb.name).toEqual("MiddlewareD");
});

test("Get controller middleware", () => {
  @middleware()
  class ControllerMiddlewareA implements MiddlewareHandler {
    name: string = "ControllerMiddlewareA";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @middleware()
  class ControllerMiddlewareB implements MiddlewareHandler {
    name: string = "ControllerMiddlewareB";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @middleware()
  class MethodAMiddleware implements MiddlewareHandler {
    name: string = "MethodAMiddleware";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @middleware()
  class MethodBMiddleware implements MiddlewareHandler {
    name: string = "MethodBMiddleware";
    handler(req: Request, res: Response, next: NextFunction) {}
  }
  @controller("/foo", ControllerMiddlewareA, ControllerMiddlewareB)
  class ControllerA {
    @httpGet("/", MethodAMiddleware) getIndex(req: Request, res: Response) {}
    @httpGet("/:id", MethodBMiddleware) postId(req: Request, res: Response) {}
  }
  let container = new Container();
  container.bind(ControllerMiddlewareA).toSelf();
  container.bind(ControllerMiddlewareB).toSelf();
  container.bind(MethodAMiddleware).toSelf();
  container.bind(MethodBMiddleware).toSelf();
  container.bind(ControllerA).toSelf();
  let c = new ControllerA();
  let meta = getControllerMiddlewareMetadata(c);
  let m = getControllerMiddleware(container, meta);
  expect(m.controller.middleware.length).toEqual(2);
  expect(m.methods["getIndex"]).toBeTruthy();
  expect(m.methods["postId"]).toBeTruthy();
  let cma = m.controller.middleware[0] as ControllerMiddlewareA;
  let cmb = m.controller.middleware[1] as ControllerMiddlewareB;
  let mam = m.methods["getIndex"].middleware[0] as MethodAMiddleware;
  let mbm = m.methods["postId"].middleware[0] as MethodBMiddleware;
  expect(cma.name).toEqual("ControllerMiddlewareA");
  expect(cmb.name).toEqual("ControllerMiddlewareB");
  expect(mam.name).toEqual("MethodAMiddleware");
  expect(mbm.name).toEqual("MethodBMiddleware");
});
