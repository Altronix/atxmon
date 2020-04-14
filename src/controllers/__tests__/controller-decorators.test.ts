import { controller, httpGet, httpPost } from "../decorators";
import { ControllerMetadata, ControllerMethodMetadata } from "../types";
import { METADATA_KEY } from "../ioc/constants";
import { Request, Response, Router } from "express";

jest.mock("express");
type MockedRouter = jest.Mocked<Router>;

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

/*
test("should map controllers", () => {
  @controller("/users")
  class ControllerA {
    @httpGet("/")
    index(req: Request, res: Response) {}
  }

  @controller("/devices")
  class ControllerB {
    @httpGet("/")
    index(req: Request, res: Response) {}
  }
});
*/
