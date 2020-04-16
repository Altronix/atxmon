import "jest";
import { DeviceEntity } from "../../entities/device.entity";
import { DeviceService } from "../device.service";
import { setup, cleanup } from "./__helpers";

const DATABASE = "device.integration.test.db";

test("Should add a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let device = await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  let read = await test.database.findById("Serial ID");
  expect(read).toBeTruthy();
  if (read) {
    expect(read.serial).toBe("Serial ID");
    expect(read.product).toBe("LINQ2");
    expect(read.prj_version).toBe("2.2.1");
    expect(read.atx_version).toBe("2.2.2");
    expect(read.web_version).toBe("2.2.3");
    expect(read.mac).toBe("00:00:00:00:00:00");
  }
  await cleanup(test);
});

test("Should find many devices", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let serial1 = await test.database.create({
    serial: "Serial ID 1",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });
  let serial2 = await test.database.create({
    serial: "Serial ID 2",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });
  let search = await test.database.find({ product: "LINQ2" });
  expect(search.length).toBe(2);
  expect(search[0].serial).toEqual("Serial ID 1");
  expect(search[1].serial).toEqual("Serial ID 2");
  cleanup(test);
});

test("Should not find a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  let device = await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  let read = await test.database.findById("NOT FOUND");
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);

  let device = await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ serial: "Serial ID" });
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should remove a device by ID", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);

  let device = await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove("Serial ID");
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should not remove a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);

  let device = await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ serial: "NOT FOUND" });
  expect(await test.database.count()).toBe(1);

  await cleanup(test);
});

test("Should update a device", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  // Check initial device
  let device = await test.database.findById("Serial ID");
  expect(device).toBeTruthy();
  if (device) expect(device.product).toBe("LINQ2");

  // Check updated device
  await test.database.update({ product: "LINQ2" }, { product: "Updated" });
  let search = await test.database.find({ product: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].product).toBe("Updated");

  await cleanup(test);
});

test("Should update a device by ID", async () => {
  let test = await setup(DeviceEntity, DeviceService, DATABASE);
  await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  // Check initial device
  let device = await test.database.findById("Serial ID");
  expect(device).toBeTruthy();
  if (device) expect(device.product).toBe("LINQ2");

  // Check updated device
  await test.database.update("Serial ID", { product: "Updated" });
  let search = await test.database.find({ product: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].product).toBe("Updated");

  await cleanup(test);
});
