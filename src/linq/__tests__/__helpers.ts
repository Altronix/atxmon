import { Container } from "inversify";
import { createContainer } from "../../ioc/container.root";
import { SYMBOLS } from "../../ioc/constants.root";
import {
  MockDeviceManager,
  MockedDeviceManager
} from "./__mocks__/linq-manager.mock";
import { LinqDeviceManager, DeviceManager } from "../types";
type LinqDeviceManagerWithMock = Omit<LinqDeviceManager, "manager"> & {
  manager: MockedDeviceManager;
};

// Rebind our container with mock @altronx/linq-network instance for this test
let container!: Container;

export async function helpersBeforeAll(): Promise<void> {
  container = await createContainer();
  container
    .rebind<DeviceManager>(SYMBOLS.DEVICE_MANAGER)
    .toDynamicValue(() => new MockDeviceManager());
}

export async function setup(): Promise<LinqDeviceManagerWithMock> {
  return container.get<LinqDeviceManagerWithMock>(SYMBOLS.LINQ_DEVICE_MANAGER);
}
