import { DatabaseDeepPartialEntity, WithOptional } from "../common/utils";
export interface Repository<E> {
  insert(
    entities: DatabaseDeepPartialEntity<E> | DatabaseDeepPartialEntity<E>[]
  ): Promise<boolean>;
  find(criteria: Criteria<E>): Promise<E | undefined>;
  // delete: (criteria: Criteria) => DatabaseResult;
}

export interface Database<Model, Entry = Model> {
  create(e: Entry): Promise<boolean>;
  find(key: Criteria<Model>): Promise<Model | undefined>;
}

export type Criteria<E> = {
  [p in keyof Partial<E>]: string | number;
};

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
