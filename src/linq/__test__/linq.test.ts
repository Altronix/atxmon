import mockLinq from "./__mocks__/linq-manager.mock";
import utils, { MockUtils } from "../../database/__test__/__mocks__/utils.mock";
import { Linq } from "../linq";

test("Linq should send", async () => {
  let linq = new Linq(utils, mockLinq);
  await linq.send("serial", "GET", "/ATX");
  expect(mockLinq.send).toHaveBeenCalledTimes(1);
});
