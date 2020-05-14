import { UserModel, UserEntry } from "./user.model";
import { DeviceEntity } from "../device/device.entity";
import {
  Entity,
  Column,
  ManyToOne,
  JoinTable,
  PrimaryGeneratedColumn
} from "typeorm";

// https://github.com/typeorm/typeorm/issues/3903
// Explanation of properties followed by "!" (fixed next release)

// Constructors inside entity makes use typeorm@next
// https://github.com/typeorm/typeorm/pull/3845

@Entity("user")
export class UserEntity implements UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  hash!: string;

  @Column()
  role!: number;

  @Column("int", { default: 0 })
  tokenVersion: number = 0;

  @ManyToOne(type => DeviceEntity)
  @JoinTable()
  devices!: DeviceEntity[];
}

export default UserEntity;
