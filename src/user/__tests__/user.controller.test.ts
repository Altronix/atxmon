import { UserController } from "../user.controller";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockLinqService from "../../device/__tests__/__mocks__/linq.service.mock";
import makeMockUserService from "./__mocks__/user.service.mock";
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

const goodUser = {
  firstName: "Tom",
  lastName: "Foo",
  phone: "1 516 333 4598",
  email: "tom@gmail.com",
  password: "111111111111",
  role: 0
};
const badUser = Object.assign({}, goodUser, { password: "foo" });

test("UserController GET /users 200", async () => {
  let { utils, userService, controller, res } = setup();
  let data: Promise<[]> = new Promise(resolve => resolve([]));
  userService.find.mockReturnValue(data);
  await controller.index(asRequest({}), asResponse(res));
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith([]);
});

test("UserController POST /users 200", async () => {
  let { utils, userService, controller, res } = setup();
  let req = { body: goodUser };
  userService.create.mockReturnValue(new Promise(resolve => resolve(true)));
  await controller.create(asRequest(req), asResponse(res));
  expect(userService.create).toBeCalledWith(
    Object.assign(req.body, { devices: [] })
  );
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith({ message: "Success" });
});

test("UserController POST /users 400", async () => {
  let { utils, userService, controller, res } = setup();
  let req = { body: badUser };
  userService.create.mockReturnValue(new Promise(resolve => resolve(true)));
  await controller.create(asRequest(req), asResponse(res));
  expect(userService.create).toHaveBeenCalledTimes(0);
  expect(res.status).toBeCalledWith(400);
  expect(res.send).toBeCalledWith({ message: "Bad request" });
});

test("UserController POST /users 403", async () => {
  let { utils, userService, controller, res } = setup();
  let req = { body: goodUser };
  userService.create.mockReturnValue(new Promise(resolve => resolve(false)));
  await controller.create(asRequest(req), asResponse(res));
  expect(userService.create).toBeCalledWith(
    Object.assign(req.body, { devices: [] })
  );
  expect(res.status).toBeCalledWith(403);
  expect(res.send).toBeCalledWith({ message: "User already exists" });
});

test("UserController DELETE /users 200", async () => {});
