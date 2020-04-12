import "jest";
import { SYMBOLS } from "../../ioc/constants.root";
import { setup } from "./__helpers";
import { ControllerDevice } from "../device.controller";

jest.mock("../../database/device");

test("Should construct", async () => {
  let test = await setup(
    ControllerDevice,
    SYMBOLS.CONTROLLER_DEVICE,
    SYMBOLS.DATABASE_DEVICE
  );
  console.log(test.database);
  expect(1).toBe(1);
});
