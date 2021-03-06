import { DeviceController } from "../device.controller";
import makeMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import makeMockLinqService from "./__mocks__/linq.service.mock";
import makeMockDeviceService from "./__mocks__/device.service.mock";
import { Request, Response } from "express";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;
function setup() {
  let linqService = makeMockLinqService();
  let utils = makeMockUtils();
  let deviceService = makeMockDeviceService();
  let controller = new DeviceController(utils, deviceService, linqService);
  let res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  return { utils, linqService, deviceService, controller, res };
}

test("DeviceController GET /devices 200", async () => {
  let { utils, linqService, deviceService, controller, res } = setup();
  deviceService.find.mockReturnValue(new Promise(resolve => resolve([])));
  await controller.index(asRequest({ query: {} }), asResponse(res));
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith([]);
});

test("DeviceController GET /devices?search 200", async () => {
  let { utils, linqService, deviceService, controller, res } = setup();
  const req = {
    query: {
      search: "product:Li",
      sort: "product",
      order: "DESC",
      start: 10,
      limit: 100
    }
  };
  deviceService.find.mockReturnValue(new Promise(resolve => resolve([])));
  await controller.index(asRequest(req), asResponse(res));
  expect(deviceService.find).toBeCalledWith({
    where: { product: "Li" },
    order: { product: "DESC" },
    skip: 10,
    take: 100
  });
});

test("DeviceController GET /devices/count 200", async () => {
  let { utils, linqService, deviceService, controller, res } = setup();
  deviceService.count.mockReturnValue(new Promise(resolve => resolve(10)));
  await controller.count(asRequest({}), asResponse(res));
  expect(deviceService.count).toBeCalledWith();
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith({ count: 10 });
});
