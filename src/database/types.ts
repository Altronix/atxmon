import { WithOptional } from "../common/utils";
import { FindOptionsWhere, QueryDeepPartialEntity } from "typeorm";
export interface Repository<E> {
  insert(
    entities: DatabaseDeepPartialEntity<E> | DatabaseDeepPartialEntity<E>[]
  ): Promise<boolean>;
  find(criteria: Criteria<E>): Promise<E | undefined>;
  remove(key: Criteria<E>): Promise<number>;
  update(key: Criteria<E>, next: DatabaseDeepPartialEntity<E>): Promise<number>;
  count(key?: Criteria<E>): Promise<number>;
}

export interface Database<Model, Entry = Model> {
  create(e: Entry): Promise<boolean>;
  find(key: Criteria<Model>): Promise<Model | undefined>;
  remove(key: Criteria<Model>): Promise<number>;
  update(
    key: Criteria<Model>,
    next: DatabaseDeepPartialEntity<Model>
  ): Promise<number>;
  count(key?: Criteria<Model>): Promise<number>;
}

// Typeorm Types are libraries in themselves. We try to decouple here
export type Criteria<E> = FindOptionsWhere<E>;
export type DatabaseDeepPartialEntity<T> = QueryDeepPartialEntity<T>;

export interface DeviceModel {
  serial: string;
  product: string;
  prj_version: string;
  atx_version: string;
  web_version: string;
  mac: string;
}

export interface UserModel {
  id: number;
  name: string;
  hash: string;
  role: number;
  devices: DeviceModel[]; //?
}

export type UserEntry = WithOptional<
  Omit<UserModel, "id" | "hash">,
  "devices"
> & { pass: string };
