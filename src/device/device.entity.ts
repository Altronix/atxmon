import { DeviceModel } from "./device.model";
import { Entity, Column, Connection, PrimaryColumn } from "typeorm";

// Explanation of properties followed by "!" (fixed next release)
// https://github.com/typeorm/typeorm/issues/3903

// Constructors inside entity makes use typeorm@next
// https://github.com/typeorm/typeorm/pull/3845

@Entity("device")
export class DeviceEntity implements DeviceModel {
  @PrimaryColumn()
  serial!: string;

  @Column()
  product!: string;

  @Column()
  prj_version!: string;

  @Column()
  atx_version!: string;

  @Column()
  web_version!: string;

  @Column()
  mac!: string;
}

export default DeviceEntity;
