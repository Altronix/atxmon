import { DeviceService } from "../../device.service";
import { OrmRepository } from "../../../ioc/orm.service";
import { UtilRoutines } from "../../../common/types";

jest.mock("../../device.service");
export default function makeMockDeviceService() {
  let utils!: UtilRoutines;
  let db!: OrmRepository<any>;
  return new DeviceService(utils, db) as jest.Mocked<DeviceService>;
}
