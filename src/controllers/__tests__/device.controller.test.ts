import "jest";
import { SYMBOLS } from "../../ioc/constants.root";
import { setup } from "./__helpers";
import { DeviceController } from "../device.controller";

test("Should construct", async () => {
  let test = await setup(DeviceController, SYMBOLS.DATABASE_DEVICE);
  expect(test.controller).toBeTruthy();
});
