import { Request, Response } from "express";
import { LogoutController } from "../logout.controller";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockLinqService from "../../device/__tests__/__mocks__/linq.service.mock";
import makeMockUserService from "../../user/__tests__/__mocks__/user.service.mock";
import constants from "../../login/constants";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
const testUser = {
  id: 3,
  firstName: "foo",
  lastName: "foo",
  phone: "1 518 333 3432",
  email: "foo@gmail.com",
  hash: "foo",
  role: 3,
  tokenVersion: 0,
  devices: [],
  notificationsServerMaintenance: false
};

function setup() {
  let utils = makeMockUtils();
  let users = makeMockUserService();
  let controller = new LogoutController(utils, users);
  let res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    cookie: jest.fn()
  };
  return { utils, users, controller, res };
}

test("logout.controller should logout user", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: { [constants.REFRESH_TOKEN_ID]: "token" } };
  let decoded = { id: 33, tokenVersion: 0 };
  let expectToken = {
    id: testUser.id,
    role: testUser.role,
    email: testUser.email,
    tokenVersion: 0
  };
  let expectUser = { ...testUser };
  delete expectUser.hash;
  utils.crypto.decodeAndValidateRefreshToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findById.mockReturnValue(new Promise(resolve => resolve(testUser)));
  await controller.refresh(asRequest(req), asResponse(res));

  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledWith("token");
  expect(users.findById).toBeCalledWith(decoded.id);
  expect(users.update).toBeCalledWith(
    { email: testUser.email },
    { tokenVersion: 1 }
  );
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith({ message: "Success" });
});

test("logout.controller should not logout user with bad cookie", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: {} };
  await controller.refresh(asRequest(req), asResponse(res));
  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledTimes(0);
  expect(users.findById).toBeCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("logout.controller should not logout user with bad token", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: { [constants.REFRESH_TOKEN_ID]: "token" } };
  utils.crypto.decodeAndValidateRefreshToken.mockRejectedValue(false);
  await controller.refresh(asRequest(req), asResponse(res));
  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledWith("token");
  expect(users.findById).toBeCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("logout.controller should not logout user with no user", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: { [constants.REFRESH_TOKEN_ID]: "token" } };
  let decoded = { id: 33 };
  utils.crypto.decodeAndValidateRefreshToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findById.mockReturnValue(new Promise(resolve => resolve(undefined)));

  await controller.refresh(asRequest(req), asResponse(res));

  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledWith("token");
  expect(users.findById).toBeCalledWith(decoded.id);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("logout.controller should not logout user with bad version", async () => {
  let { utils, users, controller, res } = setup();
  let req = { cookies: { [constants.REFRESH_TOKEN_ID]: "token" } };
  let decoded = { id: 33, tokenVersion: 2 };
  let expectToken = {
    id: testUser.id,
    role: testUser.role,
    email: testUser.email,
    tokenVersion: 0
  };
  utils.crypto.decodeAndValidateRefreshToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findById.mockReturnValue(new Promise(resolve => resolve(testUser)));

  await controller.refresh(asRequest(req), asResponse(res));

  expect(utils.crypto.decodeAndValidateRefreshToken).toBeCalledWith("token");
  expect(users.findById).toBeCalledWith(decoded.id);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});
