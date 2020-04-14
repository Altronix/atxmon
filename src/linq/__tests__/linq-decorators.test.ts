import { setup } from "./__helpers";
import { METADATA_KEY } from "../ioc/constants";
import { LinqEventHandlerMetadata } from "../types";
import { EventHandler } from "../decorators";

test("LinqEventHandler should have metadata", () => {
  @EventHandler()
  class HandlerA {}

  @EventHandler()
  class HandlerB {}

  let meta: LinqEventHandlerMetadata[] = Reflect.getMetadata(
    METADATA_KEY.eventHandler,
    Reflect
  );

  expect(meta[0].target.name).toBeTruthy();
  expect(meta[0].target.name).toEqual("HandlerB");

  expect(meta[1].target.name).toBeTruthy();
  expect(meta[1].target.name).toEqual("HandlerA");
});

test("LinqEvent should be called", () => {
  @EventHandler()
  class Handler {
    onHeartbeat(serial: string) {}
  }

  let handler = new Handler();
  let spy = jest.spyOn(handler, "onHeartbeat");

  const test = setup();
  // TODO device manager has an "emit" interface we need to spoof
  // test.manager.on("heartbeat", "SERIAL ID");
});