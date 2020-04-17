import { DatabaseService } from "../services/types";
import { UtilRoutines } from "../common/types";
import { Router, Request, Response, NextFunction } from "express";
export interface Controller<Model, Entry = Model> {}

export type ControllerConstructorTest = {
  new (r: Router, ...args: any[]): ControllerConstructorTest;
};

export type ControllerConstructor<Model, Entry = Model> = {
  new (u: UtilRoutines, d: DatabaseService<Model, Entry>): Controller<
    Model,
    Entry
  >;
};
