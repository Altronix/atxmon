import { DatabaseService } from "../services/types";
import { UtilRoutines } from "../common/types";
import { ServiceIdentifier } from "../ioc/types";
import { Router, Request, Response, NextFunction } from "express";
import { MiddlewareHandler } from "../middleware/types";
export interface Controller<Model, Entry = Model> {}

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
  new (u: UtilRoutines, d: DatabaseService<Model, Entry>): Controller<
    Model,
    Entry
  >;
};

export interface _ControllerMetadata {
  path: string;
  middleware: ServiceIdentifier<any>[] | MiddlewareHandler[];
  target: any;
}

export interface ControllerMetadata extends _ControllerMetadata {
  middleware: ServiceIdentifier<any>[];
}

export interface MethodMetadata extends _ControllerMetadata {
  method: HTTP_METHODS;
  key: string;
  middleware: ServiceIdentifier<any>[];
}

export interface ControllerMetadataResolved extends _ControllerMetadata {
  middleware: MiddlewareHandler[];
}

export interface MethodMetadataResolved extends ControllerMetadataResolved {
  method: HTTP_METHODS;
  key: string;
}
