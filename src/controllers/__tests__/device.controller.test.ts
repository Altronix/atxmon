import "jest";
import { Devices } from "../../database/device";
import { ControllerDevice } from "../device.controller";
import { setup, Mocked } from "./__helpers";

jest.mock("../../database/device");

test("Should construct", async () => {
  let test = await setup(Mocked(Devices), ControllerDevice);
  console.log(test.database);
  expect(1).toBe(1);
});
