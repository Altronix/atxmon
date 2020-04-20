import { DeviceController } from "../device.controller";
import makeMockUtils from "../../common/__test__/__mocks__/utils.mock";
import makeMockLinqService from "./__mocks__/linq.service.mock";
import makeMockDeviceService from "./__mocks__/device.service.mock";

function setup() {
  let utils = makeMockUtils();
  let linqService = makeMockLinqService();
  let deviceService = makeMockDeviceService();
  let controller = new DeviceController(utils, deviceService, linqService);
  return { utils, linqService, deviceService, controller };
}

test("Should send all", async () => {
  let { utils, linqService, deviceService, controller } = setup();
});
