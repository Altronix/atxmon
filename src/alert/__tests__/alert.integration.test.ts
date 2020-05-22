import "jest";
import { createConnection, getConnectionOptions, EntityTarget } from "typeorm";
import { Repository } from "../../ioc/types";
import { unlinkDatabase, Harness } from "../../common/__tests__/__helpers";
import getMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import Config from "../../config";
import { OrmConnection } from "../../ioc/orm.connection";
import { OrmRepository, Connection } from "../../ioc/orm.service";
import { AlertEntity } from "../alert.entity";
import { AlertModel } from "../alert.model";
import { AlertService } from "../alert.service";
import { DeviceEntity } from "../../device/device.entity";
import { DeviceService } from "../../device/device.service";

interface TestHarness extends Harness<AlertModel, AlertModel> {
  database: AlertService;
  deviceDatabase: DeviceService;
}

const DATABASE = "alert.integration.test.db";

const alert0 = {
  who: "Serial ID 0",
  what: "LINQ2",
  where: "2.2.1-0",
  when: 0,
  mesg: "alert0 mesg",
  serial: "serial0"
};

const alert1 = {
  who: "Serial ID 1",
  what: "LINQ2",
  where: "2.2.1-1",
  when: 1,
  mesg: "alert1 mesg",
  serial: "serial0"
};

const device = {
  serial: "serial0",
  site_id: "site 0",
  product: "LINQ2",
  prj_version: "2.2.1-0",
  atx_version: "2.2.2-0",
  web_version: "2.2.3-0",
  mac: "00:00:00:00:00:00",
  last_seen: 0
};

const alert = alert0;

export async function setup(file: string): Promise<TestHarness> {
  // All tests start with an empty database
  await unlinkDatabase(file);
  let utils = getMockUtils();
  let config = Object.assign(new Config().database, {
    database: file,
    name: "default" // hmmm (see above)
  });
  let connectionManager = new OrmConnection(
    createConnection,
    getConnectionOptions,
    config
  );
  let connection = await connectionManager.createConnection(config.name);
  let provider = async () => connectionManager;
  let alertRepository = new OrmRepository<AlertEntity>(utils, provider);
  let alertDatabase = new AlertService(utils, alertRepository);
  let deviceRepository = new OrmRepository<DeviceEntity>(utils, provider);
  let deviceDatabase = new DeviceService(utils, deviceRepository);

  await alertRepository.load(config.name, AlertEntity);
  await deviceRepository.load(config.name, DeviceEntity);
  deviceDatabase.create(device);
  return {
    file,
    config,
    connection,
    connectionManager,
    utils,
    database: alertDatabase,
    deviceDatabase
  };
}

// Cleanup a test
export async function cleanup(harness: TestHarness) {
  await harness.connectionManager.closeConnection(harness.config.name);
  await unlinkDatabase(harness.file);
}
test("Should add a alert", async () => {
  let test = await setup(DATABASE);
  let d = await test.database.create(alert);

  let read = await test.database.findById(1);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.who).toBe(alert.who);
    expect(read.what).toBe(alert.what);
    expect(read.where).toBe(alert.where);
    expect(read.when).toBe(alert.when);
    expect(read.mesg).toBe(alert.mesg);
    expect(read.serial).toBe(device.serial);
  }
  await cleanup(test);
});

test("Should fail if alert already exist", async () => {
  let test = await setup(DATABASE);
  let result = await test.database.create(Object.assign({}, alert0, { id: 0 }));
  expect(result).toBe(true);

  result = await test.database.create(Object.assign({}, alert1, { id: 0 }));
  expect(result).toBe(false);

  let read = await test.database.findById(0);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.serial).toBe(alert0.serial);
    expect(read.who).toBe(alert0.who);
    expect(read.what).toBe(alert0.what);
    expect(read.where).toBe(alert0.where);
    expect(read.when).toBe(alert0.when);
    expect(read.mesg).toBe(alert0.mesg);
  }
  await cleanup(test);
});

test("Should find many alerts", async () => {
  let test = await setup(DATABASE);
  let serial1 = await test.database.create(alert0);
  let serial2 = await test.database.create(alert1);
  let search = await test.database.find({ what: "LINQ2" });
  expect(search.length).toBe(2);
  expect(search[0].serial).toEqual(alert0.serial);
  expect(search[1].serial).toEqual(alert1.serial);
  await cleanup(test);
});

test("Should find all alerts", async () => {
  let test = await setup(DATABASE);
  let serial1 = await test.database.create(alert0);
  let serial2 = await test.database.create(alert1);
  let search = await test.database.find();
  expect(search.length).toBe(2);
  expect(search[0].serial).toEqual(alert0.serial);
  expect(search[1].serial).toEqual(alert1.serial);
  await cleanup(test);
});

test("Should not find a alert", async () => {
  let test = await setup(DATABASE);
  let d = await test.database.create(alert);
  let read = await test.database.findById("NOT FOUND");
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a alert", async () => {
  let test = await setup(DATABASE);

  let d = await test.database.create(alert);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ serial: alert.serial });
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should remove a alert by ID", async () => {
  let test = await setup(DATABASE);

  let d = await test.database.create(alert);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove(1);
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should not remove a alert", async () => {
  let test = await setup(DATABASE);

  let d = await test.database.create(alert);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ serial: "NOT FOUND" });
  expect(await test.database.count()).toBe(1);

  await cleanup(test);
});

test("Should update a alert", async () => {
  let test = await setup(DATABASE);
  await test.database.create(alert);

  // Check initial alert
  let d = await test.database.findById(1);
  expect(d).toBeTruthy();
  if (d) expect(d.what).toBe(alert.what);

  // Check updated alert
  await test.database.update({ when: alert.when }, { when: 100 });
  let search = await test.database.find({ when: 100 });
  expect(search.length).toBe(1);
  expect(search[0].when).toBe(100);

  await cleanup(test);
});

test("Should update a alert by ID", async () => {
  let test = await setup(DATABASE);
  await test.database.create(alert);

  // Check initial alert
  let d = await test.database.findById(1);
  expect(d).toBeTruthy();
  if (d) expect(d.who).toBe(alert.who);

  // Check updated alert
  await test.database.update(1, { when: 100 });
  let search = await test.database.find({ when: 100 });
  expect(search.length).toBe(1);
  expect(search[0].when).toBe(100);

  await cleanup(test);
});
