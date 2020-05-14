import { Request, Response } from "express";
import { LoginController } from "../login.controller";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockLinqService from "../../device/__tests__/__mocks__/linq.service.mock";
import makeMockUserService from "../../user/__tests__/__mocks__/user.service.mock";
import constants from "../constants";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
const testLogin = { email: "foo@gmail.com", password: "abcdefghijkl" };
const testUser = {
  id: 3,
  firstName: "foo",
  lastName: "foo",
  phone: "1 518 333 3432",
  email: "foo@gmail.com",
  hash: "foo",
  role: 3,
  tokenVersion: 0,
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
  let expectToken = {
    id: testUser.id,
    role: testUser.role,
    email: testUser.email
  };
  let expectUser = { ...testUser };
  delete expectUser.hash;
  let expectResponse = { accessToken: "access-token", user: expectUser };
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
  expect(res.cookie).toHaveBeenCalledWith(
    constants.REFRESH_TOKEN_ID,
    "refresh-token",
    {
      httpOnly: true,
      path: "/api/v1/login/refresh"
    }
  );
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

test("login.controller refresh should provide access token", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: { [constants.REFRESH_TOKEN_ID]: "token" } };
  let decoded = { id: 33 };
  let expectToken = {
    id: testUser.id,
    role: testUser.role,
    email: testUser.email
  };
  let expectUser = { ...testUser };
  delete expectUser.hash;
  let expectResponse = { accessToken: "access-token", user: expectUser };
  utils.crypto.decodeAndValidateRefreshToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findById.mockReturnValue(new Promise(resolve => resolve(testUser)));
  utils.crypto.createAccessToken.mockReturnValue(
    new Promise(resolve => resolve("access-token"))
  );
  utils.crypto.createRefreshToken.mockReturnValue(
    new Promise(resolve => resolve("refresh-token"))
  );
  await controller.refresh(asRequest(req), asResponse(res));

  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledWith("token");
  expect(users.findById).toBeCalledWith(decoded.id);
  expect(utils.crypto.createAccessToken).toBeCalledWith(expectToken);
  expect(utils.crypto.createRefreshToken).toBeCalledWith(expectToken);
  expect(res.cookie).toHaveBeenCalledWith(
    constants.REFRESH_TOKEN_ID,
    "refresh-token",
    {
      httpOnly: true,
      path: "/api/v1/login/refresh"
    }
  );
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(expectResponse);
});

test("login.controller refresh should send error if no token", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: {} };
  await controller.refresh(asRequest(req), asResponse(res));

  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledTimes(0);
  expect(users.findById).toBeCalledTimes(0);
  expect(utils.crypto.createAccessToken).toBeCalledTimes(0);
  expect(utils.crypto.createRefreshToken).toBeCalledTimes(0);
  expect(res.cookie).toBeCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith("Forbidden");
});

test("login.controller refresh should send error if bad token", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: { [constants.REFRESH_TOKEN_ID]: "token" } };
  utils.crypto.decodeAndValidateRefreshToken.mockRejectedValue(false);
  await controller.refresh(asRequest(req), asResponse(res));

  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledWith("token");
  expect(users.findById).toBeCalledTimes(0);
  expect(utils.crypto.createAccessToken).toBeCalledTimes(0);
  expect(utils.crypto.createRefreshToken).toBeCalledTimes(0);
  expect(res.cookie).toBeCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith("Forbidden");
});

test("login.controller refresh should send error if no user ", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: { [constants.REFRESH_TOKEN_ID]: "token" } };
  let decoded = { id: 33 };
  let expectToken = {
    id: testUser.id,
    role: testUser.role,
    email: testUser.email
  };
  utils.crypto.decodeAndValidateRefreshToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findById.mockReturnValue(new Promise(resolve => resolve(undefined)));

  await controller.refresh(asRequest(req), asResponse(res));

  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledWith("token");
  expect(users.findById).toBeCalledWith(decoded.id);
  expect(utils.crypto.createAccessToken).toBeCalledTimes(0);
  expect(utils.crypto.createRefreshToken).toBeCalledTimes(0);
  expect(res.cookie).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith("Forbidden");
});
