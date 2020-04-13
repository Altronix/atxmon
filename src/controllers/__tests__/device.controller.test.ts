import "jest";
import { SYMBOLS } from "../../ioc/constants.root";
import { setup } from "./__helpers";
import { DeviceController } from "../device.controller";

jest.mock("../../database/device");

test("Should construct", async () => {
  let test = await setup(DeviceController, SYMBOLS.DATABASE_DEVICE);
  expect(test.controller).toBeTruthy();
});
