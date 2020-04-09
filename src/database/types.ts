import { DatabaseDeepPartialEntity, WithOptional } from "../common/utils";
export interface Repository<E> {
  insert(
    entities: DatabaseDeepPartialEntity<E> | DatabaseDeepPartialEntity<E>[]
  ): Promise<boolean>;
  find(key: keyof E, value: string | number): Promise<E | undefined>;
  // delete: (criteria: Criteria) => DatabaseResult;
}

export interface Database<Model, Entry = Model> {
  create(e: Entry): Promise<boolean>;
  find(key: keyof Model, value: string | number): Promise<Model | undefined>;
}

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
