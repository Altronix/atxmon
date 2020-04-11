import { Devices } from "../../device";
jest.mock("../../device");

export type MockedDevices = jest.Mocked<Devices>;
export { Devices as MockDevices };
