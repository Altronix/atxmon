import {
  Controller,
  ControllerMetadata,
  ControllerMethodMetadata
} from "./types";
import { METADATA_KEY } from "./ioc/constants";
import { Request, Response, Router } from "express";

export function controllerRouter<Model, Entry = Model>(
  router: Router,
  controller: Controller<Model, Entry>
): Router {
  return router;
}
