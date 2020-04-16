import { DeviceService } from "../../device.service";
import { Repository } from "../../types";
import { UtilRoutines } from "../../../common/types";

jest.mock("../../device.service");
export default function makeMockDeviceService() {
  let utils!: UtilRoutines;
  let db!: Repository<any>;
  return new DeviceService(utils, db) as jest.Mocked<DeviceService>;
}
