import { WithOptional } from "../common/utils";
import { UtilRoutines } from "../common/types";
import { FindOptionsWhere, QueryDeepPartialEntity } from "typeorm";

// Embedded Device IO Service
export interface ZmtpService {
  version(): string;
  listen(port: string | number): ZmtpService;
  connect(port: string | number): ZmtpService;
  close(idx: number): this;
  send<T>(
    serial: string,
    meth: "GET" | "POST" | "DELETE",
    path: string,
    data?: T
  ): Promise<any>;
  deviceCount(): number;
  nodeCount(): number;
  run(ms: number): Promise<unknown>;
}

// Database Service
export interface DatabaseService<Model, Entry = Model> {
  create(e: Entry): Promise<boolean>;
  find(key: FindCriteria<Model>): Promise<Model | undefined>;
  remove(key: FindCriteria<Model> | IdCriteria): Promise<number>;
  update(
    key: FindCriteria<Model> | IdCriteria,
    next: DatabaseDeepPartialEntity<Model>
  ): Promise<number>;
  count(key?: FindCriteria<Model>): Promise<number>;
}

export type DatabaseConstructor<Entity, Model, Entry = Model> = {
  new (u: UtilRoutines, r: Repository<Entity>): DatabaseService<Model, Entry>;
};

// Repository
export interface Repository<E> {
  insert(
    entities: DatabaseDeepPartialEntity<E> | DatabaseDeepPartialEntity<E>[]
  ): Promise<boolean>;
  find(criteria: FindCriteria<E>): Promise<E | undefined>;
  remove(key: FindCriteria<E> | IdCriteria): Promise<number>;
  update(
    key: FindCriteria<E> | IdCriteria,
    next: DatabaseDeepPartialEntity<E>
  ): Promise<number>;
  count(key?: FindCriteria<E>): Promise<number>;
}

// Typeorm Types are libraries in themselves. We try to decouple here
export type FindCriteria<E> = FindOptionsWhere<E>;
export type IdCriteria = string | string[] | number | number[];
export type DatabaseDeepPartialEntity<T> = QueryDeepPartialEntity<T>;

// DeviceModel
export type DeviceService = DatabaseService<DeviceModel>;
export interface DeviceModel {
  serial: string;
  product: string;
  prj_version: string;
  atx_version: string;
  web_version: string;
  mac: string;
}

// UserModel
export type UserService = DatabaseService<UserModel, UserEntry>;
export interface UserModel {
  id: number;
  name: string;
  hash: string;
  role: number;
  devices: DeviceModel[]; //?
}

// UserEntry
export type UserEntry = WithOptional<
  Omit<UserModel, "id" | "hash">,
  "devices"
> & { pass: string };
