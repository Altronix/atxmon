import { setup, helpersBeforeAll } from "./__helpers";
import { METADATA_KEY } from "../ioc/constants";
import { LinqEventMetadata } from "../types";
import { linqEvent } from "../decorators";

test("LinqEvent should have metadata", () => {
  @linqEvent("heartbeat")
  class LinqHeartbeat {}

  @linqEvent("alert")
  class LinqAlert {}

  let meta: LinqEventMetadata[] = Reflect.getMetadata(
    METADATA_KEY.event,
    Reflect
  );

  expect(meta[0].target).toBeTruthy();
  expect(meta[0].event).toEqual("alert");

  expect(meta[1].target).toBeTruthy();
  expect(meta[1].event).toEqual("heartbeat");
});
