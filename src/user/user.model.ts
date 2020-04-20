import { WithOptional } from "../common/utils";
import { DeviceModel } from "../models/device.model";

import { validate, Length, IsEmail, IsInt, Min } from "class-validator";

// UserModel
export interface UserModel {
  id: number;
  name: string;
  email: string;
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
  name!: string;

  @IsEmail()
  email!: string;

  @IsInt()
  @Min(0)
  role!: number;

  @Length(12, 64)
  pass!: string;
  devices: DeviceModel[] = [];

  static async from(user: UserEntry): Promise<UserEntry> {
    let u = new User();
    let ret = Object.assign(u, user);
    if ((await validate(ret)).length) throw new Error("Invalid UserEntry");
    return u;
  }

  static async fromPartial(
    user: Partial<UserEntry>
  ): Promise<Partial<UserEntry> | undefined> {
    let u = new User();
    let ret = Object.assign(u, user);
    return (await validate(ret, { skipMissingProperties: true })).length == 0
      ? ret
      : undefined;
  }

  static async fromUntrusted(obj: any): Promise<UserEntry | undefined> {
    try {
      let u = await User.from(obj);
      return u;
    } catch {
      return undefined;
    }
  }

  static async fromUntrustedThrowable(obj: any): Promise<UserEntry> {
    return User.from(obj);
  }
}
