import { Container } from "inversify";
import { createContainer } from "../../ioc/container.root";
import commonContainerModule from "../../common/ioc/container";
import linqContainerModule from "../ioc/container";
import { MockUtils } from "../../common/__test__/__mocks__/utils.mock";
import mockDeviceManager from "./__mocks__/linq-manager.mock";
import { SYMBOLS } from "../../ioc/constants.root";
import { Linq } from "../linq";
import { LinqDeviceManager, DeviceManager } from "../types";

type MockedDeviceManager = jest.Mocked<DeviceManager>;

export interface Harness {
  manager: jest.Mocked<DeviceManager>;
  linq: LinqDeviceManager;
}

export function setup(): Harness {
  let container = new Container();
  container.load(commonContainerModule);
  container.load(linqContainerModule);
  mockDeviceManager(container);
  let utils = container.get<MockUtils>(SYMBOLS.UTIL_ROUTINES); // TODO need mock
  let manager = container.get<MockedDeviceManager>(SYMBOLS.DEVICE_MANAGER);
  let linq = new Linq(utils, manager);
  return { manager, linq };
}
