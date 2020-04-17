import { WithOptional } from "../common/utils";
import { DeviceModel } from "./device.model";

import { validate } from "class-validator";

// UserModel
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

export class User implements UserEntry {
  constructor() {}
  static async from(user: UserEntry): UserEntry {}
  static async fromUntrusted(obj: any): UserEntry {}
}
