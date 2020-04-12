import { Database } from "../database/types";
import { UtilRoutines } from "../common/types";

export interface Controller<Model, Entry = Model> {
  utils: UtilRoutines;
  database: Database<Model, Entry>;
}

export type ControllerConstructor<Model, Entry = Model> = {
  new (u: UtilRoutines, d: Database<Model, Entry>): Controller<Model, Entry>;
};
