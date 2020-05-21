import { LinqNetwork } from "@altronix/linq-network";
import { LinqService } from "../linq.service";
jest.mock("@altronix/linq-network");

type harness = {
  atx: jest.Mocked<LinqNetwork>;
  service: LinqService;
};

function setup() {
  let atx = new LinqNetwork() as jest.Mocked<LinqNetwork>;
  atx.on.mockReturnThis();
  let service = new LinqService(atx);
  return { atx, service };
}

test("linq should init", () => {
  let { atx, service } = setup();
  service.init();
  expect(atx.on).toBeCalledTimes(5);
});

test("linq should close", () => {
  let { atx, service } = setup();
  service.close(0);
  expect(atx.close).toBeCalledWith(0);
});

test("linq should listen", () => {
  let { atx, service } = setup();
  service.listen(0);
  expect(atx.listen).toBeCalledWith(0);
});

test("linq should connect", () => {
  let { atx, service } = setup();
  service.connect(0);
  expect(atx.connect).toBeCalledWith(0);
});

test("linq should send", () => {
  let { atx, service } = setup();
  service.send("123", "GET", "/ATX");
  expect(atx.send).toBeCalledWith("123", "GET", "/ATX");
});

test("linq should send with data", () => {
  let { atx, service } = setup();
  let data = { foo: "thing" };
  service.send("123", "GET", "/ATX", data);
  expect(atx.send).toBeCalledWith("123", "GET", "/ATX", data);
});

test("linq should deviceCount", () => {
  let { atx, service } = setup();
  service.deviceCount();
  expect(atx.deviceCount).toBeCalledWith();
});

test("linq should nodeCount", () => {
  let { atx, service } = setup();
  service.nodeCount();
  expect(atx.nodeCount).toBeCalledWith();
});

test("linq should run", () => {
  let { atx, service } = setup();
  service.run(0);
  expect(atx.run).toBeCalledWith(0);
});
