import { Request, Response, NextFunction } from "express";
import { IsAdminMiddleware } from "../is-admin.middleware";
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
  let middleware = new IsAdminMiddleware(utils, users);
  let next = jest.fn();
  let res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    cookie: jest.fn()
  };
  return { utils, users, middleware, res, next };
}

test("is-admin.middleware should validate admin", async () => {
  let { utils, users, middleware, res, next } = setup();
  const user: User = {
    id: 0,
    role: 0,
    tokenVersion: 0,
    email: "foo@email.com"
  } as User;

  await middleware.handler(asRequest({ user }), asResponse(res), asNext(next));
  expect(next).toBeCalledWith();
});

test("is-admin.middleware should invalidate no admin", async () => {
  let { utils, users, middleware, res, next } = setup();
  const user: User = {
    id: 0,
    role: 1,
    tokenVersion: 0,
    email: "foo@email.com"
  } as User;

  await middleware.handler(asRequest({ user }), asResponse(res), asNext(next));
  expect(next).toBeCalledTimes(0);
  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.send).toHaveBeenCalledWith({ message: "Forbidden" });
});
