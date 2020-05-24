import { DeviceQuery } from "../device.model";

test("DeviceQuery should validate string", async () => {
  const valid = "serial:f";
  expect(await DeviceQuery.valid(valid)).toEqual({ serial: "f" });
});

test("DeviceQuery should validate number", async () => {
  const valid = "serial:3";
  expect(await DeviceQuery.valid(valid)).toEqual({ serial: "3" });
});

test("DeviceQuery should invalid", async () => {
  const valid = "invalid:foo";
  let ret = await DeviceQuery.valid(valid).catch(() => false);
  expect(ret).toEqual(false);
});
