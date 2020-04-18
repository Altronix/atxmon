import { UserController } from "../user.controller";
import makeMockUtils from "../../common/__test__/__mocks__/utils.mock";
import makeMockLinqService from "../../services/__tests__/__mocks__/linq.service.mock";
import makeMockUserService from "../../services/__tests__/__mocks__/user.service.mock";
import { Request, Response } from "express";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
function setup() {
  let utils = makeMockUtils();
  let userService = makeMockUserService();
  let controller = new UserController(utils, userService);
  let res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  return { utils, userService, controller, res };
}

test("UserController GET /users success", async () => {
  let { utils, userService, controller, res } = setup();
  let data: Promise<[]> = new Promise(resolve => resolve([]));
  userService.find.mockReturnValue(data);
  await controller.index(asRequest({}), asResponse(res));
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith([]);
});
