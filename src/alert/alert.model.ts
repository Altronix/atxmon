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
