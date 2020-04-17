import { WithOptional } from "../common/utils";
import { DeviceModel } from "./device.model";

import { validate, Length, IsInt, Min } from "class-validator";

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
  @Length(3, 64)
  name: string = "";

  @IsInt()
  @Min(0)
  role: number = -1;

  @Length(12, 64)
  pass: string = "";
  devices: DeviceModel[] = [];

  static async from(user: UserEntry): Promise<UserEntry> {
    let u = new User();
    Object.assign({}, u, user);
    if ((await validate(u)).length) throw new Error("Invalid UserEntry");
    return u;
  }

  static async fromUntrusted(obj: any): Promise<UserEntry> {
    return User.from(obj);
  }
}
