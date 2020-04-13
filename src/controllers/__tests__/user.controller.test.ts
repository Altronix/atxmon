import "jest";
import { SYMBOLS } from "../../ioc/constants.root";
import { setup } from "./__helpers";
import { UserController } from "../user.controller";

test("Should construct", async () => {
  let test = await setup(UserController, SYMBOLS.DATABASE_DEVICE);
  expect(test.controller).toBeTruthy();
});
