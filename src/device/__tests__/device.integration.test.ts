import "jest";
import { DeviceEntity } from "../device.entity";
import { DeviceService } from "../device.service";
import { setup, cleanup } from "../../common/__tests__/__helpers";

const DATABASE = "device.integration.test.db";

const device0 = {
  serial: "Serial ID 0",
  product: "LINQ2",
  prj_version: "2.2.1-0",
  atx_version: "2.2.2-0",
  web_version: "2.2.3-0",
  mac: "00:00:00:00:00:00",
  last_seen: 0
};

const device1 = {
  serial: "Serial ID 1",
  product: "LINQ2",
  prj_version: "2.2.1-1",
  atx_version: "2.2.2-1",
  web_version: "2.2.3-1",
  mac: "11:11:11:11:11:11",
  last_seen: 1
};

const device = device0;

test("Should add a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let d = await test.database.create(device);

  let read = await test.database.findById(device.serial);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.serial).toBe(device.serial);
    expect(read.product).toBe(device.product);
    expect(read.prj_version).toBe(device.prj_version);
    expect(read.atx_version).toBe(device.atx_version);
    expect(read.web_version).toBe(device.web_version);
    expect(read.mac).toBe(device.mac);
  }
  await cleanup(test);
});

test("Should fail if device already exist", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let result = await test.database.create(
    Object.assign({}, device0, { serial: "e" })
  );
  expect(result).toBe(true);

  result = await test.database.create(
    Object.assign({}, device1, { serial: "e" })
  );
  expect(result).toBe(false);

  let read = await test.database.findById("e");
  expect(read).toBeTruthy();
  if (read) {
    expect(read.serial).toBe("e");
    expect(read.product).toBe(device0.product);
    expect(read.prj_version).toBe(device0.prj_version);
    expect(read.atx_version).toBe(device0.atx_version);
    expect(read.web_version).toBe(device0.web_version);
    expect(read.mac).toBe(device0.mac);
  }
  await cleanup(test);
});

test("Should find many devices", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let serial1 = await test.database.create(device0);
  let serial2 = await test.database.create(device1);
  let search = await test.database.find({ product: "LINQ2" });
  expect(search.length).toBe(2);
  expect(search[0].serial).toEqual(device0.serial);
  expect(search[1].serial).toEqual(device1.serial);
  await cleanup(test);
});

test("Should find all devices", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let serial1 = await test.database.create(device0);
  let serial2 = await test.database.create(device1);
  let search = await test.database.find();
  expect(search.length).toBe(2);
  expect(search[0].serial).toEqual(device0.serial);
  expect(search[1].serial).toEqual(device1.serial);
  await cleanup(test);
});

test("Should not find a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let d = await test.database.create(device);
  let read = await test.database.findById("NOT FOUND");
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);

  let d = await test.database.create(device);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ serial: device.serial });
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should remove a device by ID", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);

  let d = await test.database.create(device);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove(device.serial);
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should not remove a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);

  let d = await test.database.create(device);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ serial: "NOT FOUND" });
  expect(await test.database.count()).toBe(1);

  await cleanup(test);
});

test("Should update a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  await test.database.create(device);

  // Check initial device
  let d = await test.database.findById(device.serial);
  expect(d).toBeTruthy();
  if (d) expect(d.product).toBe(device.product);

  // Check updated device
  await test.database.update(
    { product: device.product },
    { product: "Updated" }
  );
  let search = await test.database.find({ product: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].product).toBe("Updated");

  await cleanup(test);
});

test("Should update a device by ID", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  await test.database.create(device);

  // Check initial device
  let d = await test.database.findById(device.serial);
  expect(d).toBeTruthy();
  if (d) expect(d.product).toBe(device.product);

  // Check updated device
  await test.database.update(device.serial, { product: "Updated" });
  let search = await test.database.find({ product: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].product).toBe("Updated");

  await cleanup(test);
});
