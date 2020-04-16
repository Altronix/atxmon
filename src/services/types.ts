import { WithOptional } from "../common/utils";
import { UtilRoutines } from "../common/types";
import { FindOptionsWhere, QueryDeepPartialEntity } from "typeorm";

// @altronix/linq-network interface
export interface AltronixLinqNetworkService {
  version(): string;
  listen(port: string | number): AltronixLinqNetworkService;
  connect(port: string | number): AltronixLinqNetworkService;
  close(idx: number): AltronixLinqNetworkService;
  on: (ev: string, handler: (...args: any[]) => void) => void;
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

// Our inversion interface (is the same)
export interface LinqNetworkService extends AltronixLinqNetworkService {
  listen(port: string | number): LinqNetworkService;
  connect(port: string | number): LinqNetworkService;
  close(idx: number): LinqNetworkService;
}

// Database Service
export interface DatabaseService<Model, Entry = Model> {
  create(e: Entry): Promise<boolean>;
  findById(key: IdCriteria): Promise<Model | undefined>;
  find(criteria?: FindCriteria<Model>): Promise<Model[]>;
  remove(key: FindCriteria<Model> | IdCriteria): Promise<number>;
  update(
    key: FindCriteria<Model> | IdCriteria,
    next: DatabaseDeepPartialEntity<Model>
  ): Promise<number>;
  count(key?: FindCriteria<Model>): Promise<number>;
}

// Repository
export interface Repository<E> {
  insert(
    entities: DatabaseDeepPartialEntity<E> | DatabaseDeepPartialEntity<E>[]
  ): Promise<boolean>;
  findById(key: IdCriteria): Promise<E | undefined>;
  find(criteria?: FindCriteria<E>): Promise<E[]>;
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
