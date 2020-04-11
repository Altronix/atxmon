import { MockUtils } from "../../common/__test__/__mocks__/utils.mock";
import {
  MockLinqNetwork,
  MockedLinqNetwork
} from "./__mocks__/linq-manager.mock";
import { Linq } from "../linq";
import { LinqDeviceManager, DeviceManager } from "../types";
import { SYMBOLS } from "../../ioc/constants.root";
import { createContainer } from "../../ioc/container.root";
import { Container } from "inversify";

type LinqDeviceManagerWithMock = Omit<LinqDeviceManager, "manager"> & {
  manager: MockedLinqNetwork;
};

let container!: Container;

// Rebind our container with mock @altronx/linq-network instance for this test
beforeAll(async () => {
  container = await createContainer();
  container
    .rebind<DeviceManager>(SYMBOLS.DEVICE_MANAGER)
    .toDynamicValue(() => new MockLinqNetwork());
});

async function setup(): Promise<LinqDeviceManagerWithMock> {
  return container.get<LinqDeviceManagerWithMock>(SYMBOLS.LINQ_DEVICE_MANAGER);
}

test("Linq should send", async () => {
  let linq = await setup();
  await linq.send("serial", "GET", "/ATX");
  expect(1).toBe(1);
  expect(linq.manager.send).toHaveBeenCalledTimes(1);
  linq.manager.send.mockClear();
});

test("Linq should on", async () => {
  let linq = await setup();
  await linq.on("ctrlc", () => {});
  expect(linq.manager.on).toHaveBeenCalledTimes(1);
  linq.manager.on.mockClear();
});

test("Linq should listen with number", async () => {
  let linq = await setup();
  linq.listen(33);
  expect(linq.manager.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.listen).toHaveBeenCalledTimes(1);
  linq.manager.listen.mockClear();
});

test("Linq should listen with string", async () => {
  let linq = await setup();
  linq.listen("tcp://*:33");
  expect(linq.manager.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.listen).toHaveBeenCalledTimes(1);
  linq.manager.listen.mockClear();
});

test("Linq should connect with number", async () => {
  let linq = await setup();
  linq.connect(33);
  expect(linq.manager.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.connect).toHaveBeenCalledTimes(1);
  linq.manager.connect.mockClear();
});

test("Linq should connect with string", async () => {
  let linq = await setup();
  linq.connect("tcp://*:33");
  expect(linq.manager.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(linq.manager.connect).toHaveBeenCalledTimes(1);
  linq.manager.connect.mockClear();
});

test("Linq should run", async () => {
  let linq = await setup();
  linq.run(30);
  expect(linq.manager.run).toBeCalledTimes(1);
  linq.manager.run.mockClear();
});
