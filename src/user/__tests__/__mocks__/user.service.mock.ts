import { UserService } from "../../user.service";
import { Repository } from "../../../ioc/types";
import { UtilRoutines } from "../../../common/types";

jest.mock("../../user.service");
export default function makeMockUserService() {
  let utils!: UtilRoutines;
  let db!: Repository<any>;
  return new UserService(utils, db) as jest.Mocked<UserService>;
}
