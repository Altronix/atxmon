import { FindOpts, FindSort, FindWhere } from "../ioc/types";
import { Request } from "express";

// Remap database query type to our public facing api query type
export type Query<E> = Omit<
  FindOpts<E>,
  "order" | "where" | "skip" | "take"
> & {
  sort?: FindSort<E>;
  search?: FindWhere<E>;
  start?: number;
  limit?: number;
};
