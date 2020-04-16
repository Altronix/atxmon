import { UserModel, DeviceModel } from "../services/types";
import { DeviceEntity } from "./device.entity";
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
  name!: string;

  @Column()
  hash!: string;

  @Column()
  role!: number;

  @ManyToOne(type => DeviceEntity)
  @JoinTable()
  devices!: DeviceEntity[];
}

export default UserEntity;
