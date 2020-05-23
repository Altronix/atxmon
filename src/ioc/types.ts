import * as jwt from "jsonwebtoken";
import { Subject } from "rxjs";
import { Events } from "../device/linq.service";
import * as bcrypt from "bcrypt";
import { DatabaseConfig } from "../common/types";
import {
  Connection,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  Repository as TypeormRepository,
  EntityTarget
} from "typeorm";

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface Abstract<T> {
  prototype: T;
}

export type ServiceIdentifier<T> = string | symbol | Newable<T> | Abstract<T>;

export type JwtRoutines = typeof jwt;
export type BcryptRoutines = typeof bcrypt;

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

// Connection manager
export interface ConnectionManager {
  createConnection: (name: string) => Promise<Connection>;
  closeConnection: (name: string) => Promise<void>;
  getConnection: (name: string) => Connection;
}

// Repository (interface OrmRepository)
export interface Repository<E> {
  repository: TypeormRepository<E>;
  load: (name: string, e: EntityTarget<E>) => Promise<void>;
}

// Typeorm Types are libraries in themselves. We try to decouple here
export type FindCriteria<E> = FindOptionsWhere<E>;
export type IdCriteria = string | string[] | number | number[];
export type DatabaseDeepPartialEntity<T> = QueryDeepPartialEntity<T>;

// Our inversion interface (is the same)
export interface LinqNetworkService extends AltronixLinqNetworkService {
  events$: Subject<Events>;
  init(): LinqNetworkService;
  listen(port: string | number): LinqNetworkService;
  shutdown: () => void;
  on: (ev: string, handler: (...args: any[]) => void) => LinqNetworkService;
  connect(port: string | number): LinqNetworkService;
  close(idx: number): LinqNetworkService;
}

// @altronix/linq-network interface
export interface AltronixLinqNetworkService {
  version(): string;
  shutdown: () => void;
  listen(port: string | number): AltronixLinqNetworkService;
  connect(port: string | number): AltronixLinqNetworkService;
  close(idx: number): AltronixLinqNetworkService;
  on: (e: string, h: (...args: any[]) => void) => AltronixLinqNetworkService;
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
