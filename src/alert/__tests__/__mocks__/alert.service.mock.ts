import { AlertService } from "../../alert.service";
import { OrmRepository } from "../../../ioc/orm.service";
import { UtilRoutines } from "../../../common/types";

jest.mock("../../alert.service");
export default function makeMockDeviceService() {
  let utils!: UtilRoutines;
  let db!: OrmRepository<any>;
  return new AlertService(utils, db) as jest.Mocked<AlertService>;
}
