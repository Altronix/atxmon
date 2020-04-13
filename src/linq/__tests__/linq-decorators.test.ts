import { setup, helpersBeforeAll } from "./__helpers";
import { linqEvent } from "../decorators";

@linqEvent("heartbeat")
class LinqHeartbeatHandler {}

test("LinqEvent should have metadata", () => {
  let hb = new LinqHeartbeatHandler();
  expect(hb).toBeTruthy();
  console.log(hb);
});
