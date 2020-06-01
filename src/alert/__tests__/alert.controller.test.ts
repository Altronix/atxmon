import { AlertController } from "../alert.controller";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockAlertService from "./__mocks__/alert.service.mock";
import { Request, Response } from "express";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
function setup() {
  let utils = makeMockUtils();
  let deviceService = makeMockAlertService();
  let controller = new AlertController(utils, deviceService);
  let res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  return { utils, deviceService, controller, res };
}

test("AlertController GET /alerts 200", async () => {
  let { utils, deviceService, controller, res } = setup();
  deviceService.find.mockReturnValue(new Promise(resolve => resolve([])));
  await controller.index(asRequest({}), asResponse(res));
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith([]);
});

// TODO alert query tests (similar to device.controller.test.ts...
