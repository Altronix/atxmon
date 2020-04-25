import { ShutdownController } from "../shutdown.controller";
import { ShutdownService } from "../shutdown.service";
import { Request, Response } from "express";

const asResponse = (res: any): Response => res as Response;
const asRequest = (req: any): Request => req as Request;

test("shutdown.controller should shutdown", async () => {
  let shutdownService = ({ shutdown: jest.fn() } as any) as ShutdownService;
  let shutdownController = new ShutdownController(shutdownService);
  let res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  await shutdownController.shutdown(asRequest({}), asResponse(res));
  expect(shutdownService.shutdown).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith("Shutting down...");
});
