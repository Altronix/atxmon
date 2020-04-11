// TODO try and rebind mocks from container
// IE 
// @injectable
// Class MockLinq()...
import { LinqNetwork } from "@altronix/linq-network";
jest.mock("@altronix/linq-network");
export type MockLinqNetwork = jest.Mocked<LinqNetwork>;
export default () => new LinqNetwork() as MockLinqNetwork;
