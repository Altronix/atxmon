import { UserService } from "../../user.service";
import { OrmRepository } from "../../../ioc/orm.service";
import { UtilRoutines } from "../../../common/types";

jest.mock("../../user.service");
export default function makeMockUserService() {
  let utils!: UtilRoutines;
  let db!: OrmRepository<any>;
  return new UserService(utils, db) as jest.Mocked<UserService>;
}
