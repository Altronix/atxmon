import mockLinq from "./__mocks__/linq-manager.mock";
import utils, { MockUtils } from "../../database/__test__/__mocks__/utils.mock";
import { Linq } from "../linq";

test("Linq should send", async () => {
  let linq = new Linq(utils, mockLinq);
  await linq.send("serial", "GET", "/ATX");
  expect(mockLinq.send).toHaveBeenCalledTimes(1);
  mockLinq.send.mockClear(); // TODO
});

test("Linq should on", async () => {
  let linq = new Linq(utils, mockLinq);
  await linq.on("ctrlc", () => {});
  expect(mockLinq.on).toHaveBeenCalledTimes(1);
  mockLinq.on.mockClear(); // TODO
});

test("Linq should listen with number", () => {
  let linq = new Linq(utils, mockLinq);
  linq.listen(33);
  expect(mockLinq.listen).toHaveBeenCalledWith("tcp://*:33");
});
