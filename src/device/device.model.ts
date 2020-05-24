import { validate, validateSync, IsInt, IsString } from "class-validator";

// DeviceModel
export interface DeviceModel {
  serial: string;
  site_id: string;
  product: string;
  prj_version: string;
  atx_version: string;
  web_version: string;
  mac: string;
  last_seen: number;
}

export class DeviceQuery implements DeviceModel {
  @IsString()
  serial!: string;

  @IsString()
  site_id!: string;

  @IsString()
  product!: string;

  @IsString()
  prj_version!: string;

  @IsString()
  atx_version!: string;

  @IsString()
  web_version!: string;

  @IsString()
  mac!: string;

  @IsInt()
  last_seen!: number;

  static async valid(obj: any): Promise<DeviceModel> {
    if (!(typeof obj === "string")) throw "invalid query";
    obj = obj.split(":");
    if (!(obj.length === 2)) throw "invalid query";
    let c = new DeviceQuery();
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

export type DeviceModelEntry = Omit<DeviceModel, "last_seen">;
