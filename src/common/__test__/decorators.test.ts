import { controller, httpGet, httpPost, createRouter } from "../decorators";
import {
  ControllerMetadata,
  ControllerMethodMetadata
} from "../../controllers/types";
import { METADATA_KEY } from "../../ioc/constants.root";
import { Request, Response, Router } from "express";
import { Container } from "inversify";

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

  let metaMethodsA: ControllerMethodMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controllerMethod,
    ControllerA
  );

  let metaMethodsB: ControllerMethodMetadata[] = Reflect.getMetadata(
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
  let metaMethods: ControllerMethodMetadata[] = Reflect.getMetadata(
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
