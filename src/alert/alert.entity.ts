import { AlertModel } from "./alert.model";
import { DeviceEntity } from "../device/device.entity";
import { DeviceModel } from "../device/device.model";
import {
  Entity,
  ManyToOne,
  Column,
  Connection,
  JoinColumn,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity("alert")
export class AlertEntity implements AlertModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  who!: string;

  @Column()
  what!: string;

  @Column()
  where!: string;

  @Column()
  when!: number;

  @Column()
  mesg!: string;

  @Column()
  serial!: string;

  @ManyToOne(type => DeviceEntity)
  @JoinColumn({ name: "serial" })
  device!: DeviceEntity;
}
