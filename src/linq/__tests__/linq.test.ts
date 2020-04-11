import getMockLinq from "./__mocks__/linq-manager.mock";
import { MockUtils } from "../../common/__test__/__mocks__/utils.mock";
import getMockUtils from "../../common/__test__/__mocks__/utils.mock";
import { Linq } from "../linq";

let utils = getMockUtils();
let mockLinq = getMockLinq();

test("Linq should send", async () => {
  let linq = new Linq(utils, mockLinq);
  await linq.send("serial", "GET", "/ATX");
  expect(mockLinq.send).toHaveBeenCalledTimes(1);
  mockLinq.send.mockClear();
});

test("Linq should on", async () => {
  let linq = new Linq(utils, mockLinq);
  await linq.on("ctrlc", () => {});
  expect(mockLinq.on).toHaveBeenCalledTimes(1);
  mockLinq.on.mockClear();
});

test("Linq should listen with number", () => {
  let linq = new Linq(utils, mockLinq);
  linq.listen(33);
  expect(mockLinq.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(mockLinq.listen).toHaveBeenCalledTimes(1);
  mockLinq.listen.mockClear();
});

test("Linq should listen with string", () => {
  let linq = new Linq(utils, mockLinq);
  linq.listen("tcp://*:33");
  expect(mockLinq.listen).toHaveBeenCalledWith("tcp://*:33");
  expect(mockLinq.listen).toHaveBeenCalledTimes(1);
  mockLinq.listen.mockClear();
});

test("Linq should connect with number", () => {
  let linq = new Linq(utils, mockLinq);
  linq.connect(33);
  expect(mockLinq.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(mockLinq.connect).toHaveBeenCalledTimes(1);
  mockLinq.connect.mockClear();
});

test("Linq should connect with string", () => {
  let linq = new Linq(utils, mockLinq);
  linq.connect("tcp://*:33");
  expect(mockLinq.connect).toHaveBeenCalledWith("tcp://*:33");
  expect(mockLinq.connect).toHaveBeenCalledTimes(1);
  mockLinq.connect.mockClear();
});

test("Linq should run", async () => {
  let linq = new Linq(utils, mockLinq);
  linq.run(30);
  expect(mockLinq.run).toBeCalledTimes(1);
  mockLinq.run.mockClear();
});
