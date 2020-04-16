import { UserController } from "../user.controller";
import makeMockUtils from "../../common/__test__/__mocks__/utils.mock";
import makeMockLinqService from "../../services/__tests__/__mocks__/linq.service.mock";
import makeMockUserService from "../../services/__tests__/__mocks__/user.service.mock";

function setup() {
  let utils = makeMockUtils();
  let deviceService = makeMockUserService();
  let controller = new UserController(utils, deviceService);
  return { utils, deviceService, controller };
}

test("Should send all", async () => {
  let { utils, deviceService, controller } = setup();
});
