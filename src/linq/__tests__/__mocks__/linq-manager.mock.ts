import { injectable } from "inversify";
import { LinqNetwork as DeviceManager } from "@altronix/linq-network";
jest.mock("@altronix/linq-network");

// DeviceManager
export type MockedDeviceManager = jest.Mocked<DeviceManager>;

@injectable()
export class MockDeviceManager extends DeviceManager {}
