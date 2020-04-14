import { controller, httpGet } from "../decorators";
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
    @httpGet("/")
    index(req: Request, res: Response) {}
  }

  let meta: ControllerMetadata[] = Reflect.getMetadata(
    METADATA_KEY.controller,
    Reflect
  );

  expect(meta[0].target.name).toBeTruthy();
  expect(meta[0].target.name).toEqual("ControllerB");
  expect(meta[0].path).toEqual("/devices");
  expect(meta[0].middleware.length).toEqual(0);

  expect(meta[1].target.name).toBeTruthy();
  expect(meta[1].target.name).toEqual("ControllerA");
  expect(meta[1].path).toEqual("/users");
  expect(meta[1].middleware.length).toEqual(0);
});

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
