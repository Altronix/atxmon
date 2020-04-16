import { LinqService } from "../../linq.service";
import { AltronixLinqNetworkService, Repository } from "../../types";
import { UtilRoutines } from "../../../common/types";

jest.mock("../../device.service");
export default function makeMockLinqService() {
  let utils!: UtilRoutines;
  let atx!: AltronixLinqNetworkService;
  return new LinqService(atx) as jest.Mocked<LinqService>;
}
