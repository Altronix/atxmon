import { Request, Response, NextFunction } from "express";
import { ValidUserMiddleware } from "../valid-user.middleware";
import { User } from "../../user/user.model";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockLinqService from "../../device/__tests__/__mocks__/linq.service.mock";
import makeMockUserService from "../../user/__tests__/__mocks__/user.service.mock";
import { RefreshToken } from "../../login/token";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
const asNext = (next: any): NextFunction => next as NextFunction;
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
  devices: [],
  notificationsServerMaintenance: false
};

function setup() {
  let utils = makeMockUtils();
  let users = makeMockUserService();
  let middleware = new ValidUserMiddleware(utils, users);
  let next = jest.fn();
  let res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    cookie: jest.fn()
  };
  return { utils, users, middleware, res, next };
}

test("valid-user.middleware should validate user", async () => {
  let { utils, users, middleware, res, next } = setup();
  const decoded: RefreshToken = {
    id: 0,
    role: 0,
    tokenVersion: 0,
    email: "foo@email.com"
  };
  const user = { ...decoded };

  utils.crypto.decodeAndValidateAccessToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findByEmail.mockReturnValue(
    new Promise(resolve => resolve(user as User))
  );
  await middleware.handler(
    asRequest({ headers: { authorization: "Bearer foo" } }),
    asResponse(res),
    asNext(next)
  );
  expect(next).toBeCalledWith();
});

test("valid-user.middleware should fail no header", async () => {
  let { utils, users, middleware, res, next } = setup();
  await middleware.handler(
    asRequest({ headers: {} }),
    asResponse(res),
    asNext(next)
  );
  expect(utils.crypto.decodeAndValidateAccessToken).toHaveBeenCalledTimes(0);
  expect(users.findByEmail).toHaveBeenCalledTimes(0);
  expect(next).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("valid-user.middleware should fail no token", async () => {
  let { utils, users, middleware, res, next } = setup();
  const decoded: RefreshToken = {
    id: 0,
    role: 0,
    tokenVersion: 0,
    email: "foo@email.com"
  };

  utils.crypto.decodeAndValidateAccessToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  await middleware.handler(
    asRequest({ headers: { authorization: "Bearer" } }),
    asResponse(res),
    asNext(next)
  );
  expect(utils.crypto.decodeAndValidateAccessToken).toHaveBeenCalledTimes(0);
  expect(users.findByEmail).toHaveBeenCalledTimes(0);
  expect(next).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("valid-user.middleware should fail invalid token", async () => {
  let { utils, users, middleware, res, next } = setup();
  const decoded: RefreshToken = {
    id: 0,
    role: 0,
    tokenVersion: 0,
    email: "foo@email.com"
  };

  utils.crypto.decodeAndValidateAccessToken.mockReturnValue(
    new Promise((resolve, reject) => reject(undefined))
  );
  await middleware.handler(
    asRequest({ headers: { authorization: "Bearer foo" } }),
    asResponse(res),
    asNext(next)
  );
  expect(utils.crypto.decodeAndValidateAccessToken).toHaveBeenCalledWith("foo");
  expect(users.findByEmail).toHaveBeenCalledTimes(0);
  expect(next).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("valid-user.middleware should fail user doesn't exist", async () => {
  let { utils, users, middleware, res, next } = setup();
  const decoded: RefreshToken = {
    id: 0,
    role: 0,
    tokenVersion: 0,
    email: "foo@email.com"
  };

  utils.crypto.decodeAndValidateAccessToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findByEmail.mockReturnValue(new Promise(resolve => resolve(undefined)));
  await middleware.handler(
    asRequest({ headers: { authorization: "Bearer foo" } }),
    asResponse(res),
    asNext(next)
  );
  expect(utils.crypto.decodeAndValidateAccessToken).toHaveBeenCalledWith("foo");
  expect(users.findByEmail).toHaveBeenCalledWith("foo@email.com");
  expect(next).toHaveBeenCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});

test("valid-user.middleware should fail token version invalid", async () => {
  let { utils, users, middleware, res, next } = setup();
  const decoded: RefreshToken = {
    id: 0,
    role: 0,
    tokenVersion: 0,
    email: "foo@email.com"
  };
  const user = { ...decoded, tokenVersion: 1 };

  utils.crypto.decodeAndValidateAccessToken.mockReturnValue(
    new Promise(resolve => resolve(decoded))
  );
  users.findByEmail.mockReturnValue(
    new Promise(resolve => resolve(user as User))
  );
  await middleware.handler(
    asRequest({ headers: { authorization: "Bearer foo" } }),
    asResponse(res),
    asNext(next)
  );
  expect(next).toHaveBeenCalledTimes(0);
  expect(utils.crypto.decodeAndValidateAccessToken).toHaveBeenCalledWith("foo");
  expect(users.findByEmail).toHaveBeenCalledWith("foo@email.com");
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});
