import { AlertService } from "../../alert.service";
import { Repository } from "../../../ioc/types";
import { UtilRoutines } from "../../../common/types";

jest.mock("../../alert.service");
export default function makeMockDeviceService() {
  let utils!: UtilRoutines;
  let db!: Repository<any>;
  return new AlertService(utils, db) as jest.Mocked<AlertService>;
}
