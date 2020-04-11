import { Database } from "../database/types";
import { UtilRoutines } from "../common/types";

export interface Controller<Model, Entry = Model> {
  utils: UtilRoutines;
  database: Database<Model, Entry>;
}
