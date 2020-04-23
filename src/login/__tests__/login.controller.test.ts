import { Request, Response } from "express";
import { LoginController } from "../login.controller";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockLinqService from "../../device/__tests__/__mocks__/linq.service.mock";
import makeMockUserService from "../../user/__tests__/__mocks__/user.service.mock";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
const testLogin = { email: "foo@gmail.com", password: "abcdefghijkl" };
const testUser = {
  id: 3,
  name: "foo",
  email: "foo@gmail.com",
  hash: "foo",
  role: 3,
  devices: []
};
function setup() {
  let utils = makeMockUtils();
  let users = makeMockUserService();
  let controller = new LoginController(utils, users);
  let res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    cookie: jest.fn()
  };
  return { utils, users, controller, res };
}

test("login.controller should provided valid tokens", async () => {
  let { utils, users, controller, res } = setup();
  let req = { body: testLogin };
  let expectToken = { role: testUser.role, email: testUser.email };
  let expectResponse = { accessToken: "access-token" };
  users.findByEmail.mockReturnValue(new Promise(resolve => resolve(testUser)));
  utils.crypto.validate.mockReturnValue(new Promise(resolve => resolve(true)));
  utils.crypto.createAccessToken.mockReturnValue(
    new Promise(resolve => resolve("access-token"))
  );
  utils.crypto.createRefreshToken.mockReturnValue(
    new Promise(resolve => resolve("refresh-token"))
  );
  await controller.login(asRequest(req), asResponse(res));

  expect(utils.crypto.createAccessToken).toBeCalledWith(expectToken);
  expect(utils.crypto.createRefreshToken).toBeCalledWith(expectToken);
  expect(res.cookie).toHaveBeenCalledWith("mondle", "refresh-token", {
    httpOnly: true,
    path: "/login/refresh"
  });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(expectResponse);
});

test("login.controller should deny access payload bad format", async () => {
  let { utils, users, controller, res } = setup();
  let req = { body: { foo: "junk", user: 3 } };
  await controller.login(asRequest(req), asResponse(res));

  expect(users.findByEmail).toBeCalledTimes(0);
  expect(utils.crypto.validate).toBeCalledTimes(0);
  expect(utils.crypto.createAccessToken).toBeCalledTimes(0);
  expect(utils.crypto.createRefreshToken).toBeCalledTimes(0);
  expect(res.cookie).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith("Forbidden");
});

test("login.controller should deny access if user  doesn't exists", async () => {
  let { utils, users, controller, res } = setup();
  let req = { body: testLogin };
  users.findByEmail.mockReturnValue(new Promise(resolve => resolve(undefined)));
  await controller.login(asRequest(req), asResponse(res));

  expect(utils.crypto.validate).toBeCalledTimes(0);
  expect(utils.crypto.createAccessToken).toBeCalledTimes(0);
  expect(utils.crypto.createRefreshToken).toBeCalledTimes(0);
  expect(res.cookie).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith("Forbidden");
});

test("login.controller should deny access if password is invalid", async () => {
  let { utils, users, controller, res } = setup();
  let req = { body: testLogin };
  let expectToken = { role: testUser.role, email: testUser.email };
  let expectResponse = { accessToken: "access-token" };
  users.findByEmail.mockReturnValue(new Promise(resolve => resolve(testUser)));
  utils.crypto.validate.mockReturnValue(new Promise(resolve => resolve(false)));
  await controller.login(asRequest(req), asResponse(res));

  expect(utils.crypto.createAccessToken).toBeCalledTimes(0);
  expect(utils.crypto.createRefreshToken).toBeCalledTimes(0);
  expect(utils.crypto.createAccessToken).toBeCalledTimes(0);
  expect(utils.crypto.createRefreshToken).toBeCalledTimes(0);
  expect(res.cookie).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith("Forbidden");
});
