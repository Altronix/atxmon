import { AlertController } from "../alert.controller";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockAlertService from "./__mocks__/alert.service.mock";
import { Request, Response } from "express";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
function setup() {
  let utils = makeMockUtils();
  let alertService = makeMockAlertService();
  let controller = new AlertController(utils, alertService);
  let res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  return { utils, alertService, controller, res };
}

test("AlertController GET /alerts 200", async () => {
  let { utils, alertService, controller, res } = setup();
  alertService.find.mockReturnValue(new Promise(resolve => resolve([])));
  await controller.index(asRequest({ query: {} }), asResponse(res));
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith([]);
});

// TODO alert query tests (similar to device.controller.test.ts...
