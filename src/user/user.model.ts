import { WithOptional } from "../common/utils";
import { DeviceModel } from "../device/device.model";

import {
  validate,
  Length,
  IsMobilePhone,
  IsBoolean,
  IsEmail,
  IsInt,
  Min
} from "class-validator";

// UserModel
export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  hash: string;
  role: number;
  tokenVersion: number;
  notificationsServerMaintenance: boolean;
  devices: DeviceModel[]; //?
}

// UserEntry
export type UserEntry = WithOptional<
  Omit<UserModel, "id" | "hash" | "tokenVersion">,
  "devices"
> & { password: string };

export class User implements UserModel {
  id!: number;

  @Length(3, 128)
  firstName!: string;

  @Length(3, 128)
  lastName!: string;

  @IsMobilePhone("en-US")
  phone!: string;

  @IsEmail()
  email!: string;

  @IsInt()
  @Min(0)
  role!: number;

  @Length(12, 64)
  password!: string;

  @IsBoolean()
  notificationsServerMaintenance!: boolean;

  tokenVersion!: number;

  hash!: string;

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
