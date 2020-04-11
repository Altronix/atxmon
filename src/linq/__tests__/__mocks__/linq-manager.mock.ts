import { injectable } from "inversify";
import { LinqNetwork } from "@altronix/linq-network";
jest.mock("@altronix/linq-network");

// DeviceManager
export type MockedLinqNetwork = jest.Mocked<LinqNetwork>;

@injectable()
export class MockLinqNetwork extends LinqNetwork {}
//export default () => new LinqNetwork() as MockLinqNetwork;
