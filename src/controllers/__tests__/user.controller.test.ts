import "jest";
import { SYMBOLS } from "../../ioc/constants.root";
import { setup } from "./__helpers";
import { ControllerUser } from "../user.controller";

test("Should construct", async () => {
  let test = await setup(
    ControllerUser,
    SYMBOLS.CONTROLLER_DEVICE,
    SYMBOLS.DATABASE_DEVICE
  );
  expect(1).toBe(1);
});
