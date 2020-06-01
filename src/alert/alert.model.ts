import {
  validate,
  validateSync,
  IsInt,
  IsNumber,
  IsString
} from "class-validator";
import { DeviceModel } from "../device/device.model";
export interface AlertModel {
  id: number;
  who: string;
  what: string;
  where: string;
  when: number;
  mesg: string;
  serial: string;
  device: DeviceModel;
}

export type AlertEntry = Omit<AlertModel, "id" | "device">;

export class AlertQuery implements Omit<AlertModel, "id" | "device"> {
  @IsString()
  who!: string;

  @IsString()
  what!: string;

  @IsString()
  where!: string;

  @IsNumber()
  when!: number;

  @IsString()
  mesg!: string;

  @IsString()
  serial!: string;

  static async valid(obj: any): Promise<AlertQuery> {
    if (!(typeof obj === "string")) throw "invalid query";
    obj = obj.split(":");
    if (!(obj.length === 2)) throw "invalid query";
    let c = new AlertQuery();
    Object.assign(c, { [`${obj[0]}`]: obj[1] });
    let ret = await validate(c, {
      skipMissingProperties: true,
      whitelist: true
    });
    if (!Object.keys(c).length) throw "invalid query";
    if (ret.length) throw ret;
    return c;
  }
}
