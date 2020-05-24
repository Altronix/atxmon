import { DeviceQuery } from "../device.model";

test("DeviceQuery should validate with object", async () => {
  const valid = { serial: "f" };
  expect(await DeviceQuery.valid(valid)).toEqual({ serial: "f" });
});

test("DeviceQuery should validate with string", async () => {
  const valid = '{"serial":"f"}';
  expect(await DeviceQuery.valid(valid)).toEqual({ serial: "f" });
});

test("DeviceQuery should invalidate with object", async () => {
  const invalid = { serial: 3 };
  let ret = await DeviceQuery.valid(invalid).catch(() => false);
  expect(ret).toEqual(false);
});

test("DeviceQuery should invalidate with string", async () => {
  const invalid = '{"serial":3}';
  let ret = await DeviceQuery.valid(invalid).catch(() => false);
  expect(ret).toEqual(false);
});

test("DeviceQuery should strip invalid props", async () => {
  const valid = { serial: "f", foo: "bar" };
  expect(await DeviceQuery.valid(valid)).toEqual({ serial: "f" });
});
