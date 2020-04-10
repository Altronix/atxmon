import "jest";
import { DeviceEntity } from "../orm/entities/device.entity";
import { Devices } from "../device";
import { setup, cleanup } from "./_helpers";

const DATABASE = "device.integraton.test.db";

test("Should add a device", async () => {
  let test = await setup(DeviceEntity, Devices, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let device = await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  let read = await test.database.find({ serial: "Serial ID" });
  expect(read).toBeTruthy();
  if (read) {
    expect(read.serial).toBe("Serial ID");
    expect(read.product).toBe("LINQ2");
    expect(read.prj_version).toBe("2.2.1");
    expect(read.atx_version).toBe("2.2.2");
    expect(read.web_version).toBe("2.2.3");
    expect(read.mac).toBe("00:00:00:00:00:00");
  }
  await test.connection.close();
});

test("Should not find a device", async () => {
  let test = await setup(DeviceEntity, Devices, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    serial: "Serial ID",
    product: "LINQ2",
    prj_version: "2.2.1",
    atx_version: "2.2.2",
    web_version: "2.2.3",
    mac: "00:00:00:00:00:00"
  });

  let read = await test.database.find({ serial: "NOT  FOUND" });
  expect(read).toBeFalsy();
  await test.connection.close();
});
