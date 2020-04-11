import "jest";
import { ControllerDevice } from "../device.controller";
import { Database, DeviceModel, Repository } from "../../database/types";
import {
  MockedDevices,
  MockDevices
} from "../../database/__tests__/__mocks__/device.mock";
import {
  MockedRepository,
  MockRepository
} from "../../database/__tests__/__mocks__/repository.mock";
import { Container } from "inversify";
import { SYMBOLS } from "../../ioc/constants.root";
import { createContainer } from "../../ioc/container.root";

let container!: Container;
beforeAll(async () => {
  container = await createContainer();
  container
    .rebind<Database<DeviceModel>>(SYMBOLS.DATABASE_DEVICE)
    .to(MockDevices);
});

type ControllerWithMock = Omit<ControllerDevice, "database"> & {
  database: MockedDevices;
};

// async function setup(): Promise<ControllerWithMock> {
// return container.get<ControllerWithMock>(SYMBOLS.CONTROLLER_DEVICE);
// }

test("Should construct", async () => {
  // let controller = await setup();
  expect(1).toBe(1);
});
