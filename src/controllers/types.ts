import { Database } from "../database/types";
import { UtilRoutines } from "../common/types";
import { ServiceIdentifier } from "../ioc/types";
import { Router, Request, Response, NextFunction } from "express";
export interface Controller<Model, Entry = Model> {
  utils: UtilRoutines;
  database: Database<Model, Entry>;
}

export type HTTP_ALL = "all";
export type HTTP_GET = "get";
export type HTTP_POST = "post";
export type HTTP_PUT = "put";
export type HTTP_PATCH = "patch";
export type HTTP_HEAD = "head";
export type HTTP_DELETE = "delete";
export type HTTP_METHODS =
  | HTTP_ALL
  | HTTP_GET
  | HTTP_POST
  | HTTP_PUT
  | HTTP_PATCH
  | HTTP_HEAD
  | HTTP_DELETE;

export type ControllerConstructorTest = {
  new (r: Router, ...args: any[]): ControllerConstructorTest;
};

export type ControllerConstructor<Model, Entry = Model> = {
  new (u: UtilRoutines, d: Database<Model, Entry>): Controller<Model, Entry>;
};

export interface ControllerMetadata {
  path: string;
  middleware: ServiceIdentifier<any>[];
  target: any;
}

export interface ControllerMethodMetadata extends ControllerMetadata {
  method: HTTP_METHODS;
  key: string;
}
