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
  console.log(test.database);
  expect(1).toBe(1);
});
