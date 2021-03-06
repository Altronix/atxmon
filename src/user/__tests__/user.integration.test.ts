import "jest";
import { UserEntity } from "../user.entity";
import { UserEntry } from "../user.model";
import { UserService } from "../user.service";
import { setup, cleanup } from "../../common/__tests__/__helpers";

const DATABASE = "user.integration.test.db";

const user0 = {
  firstName: "Thomas0",
  lastName: "FOO0",
  phone: "5550000000",
  email: "tom0@gmail.com",
  password: "tom0secret123456",
  role: 0,
  notificationsServerMaintenance: false
};
const user1 = {
  firstName: "Thomas1",
  lastName: "FOO1",
  phone: "5551111111",
  email: "tom1@gmail.com",
  password: "tom1secret123456",
  role: 0,
  notificationsServerMaintenance: false
};
const user = user0;
const hash = "development-unsafe-hash-for-test";

test("Should add a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  let u = await test.database.create(user);

  expect(await test.database.count()).toBe(1);
  let read = await test.database.findById(1);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe(hash);
    expect(read.firstName).toBe(user.firstName);
    expect(read.email).toBe(user.email);
    expect(read.role).toBe(user.role);
    expect(read.tokenVersion).toBe(0);
    expect(read.devices).toBeFalsy();
  }
  await cleanup(test);
});

test("Should fail if user already exist", async () => {
  let result;
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  result = await test.database.create(Object.assign({}, user0, { id: 0 }));
  expect(result).toBe(true);

  result = await test.database
    .create(Object.assign({}, user1, { id: 0 }))
    .catch(e => false);
  expect(result).toBe(false);

  let read = await test.database.findById(0);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe(hash);
    expect(read.firstName).toBe(user0.firstName);
    expect(read.email).toBe(user0.email);
    expect(read.role).toBe(user0.role);
    expect(read.devices).toBeFalsy();
  }
  await cleanup(test);
});

test("Should fail if user already exists by email", async () => {
  let result;
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  result = await test.database.create(
    Object.assign({}, user0, { email: "tom@tom.com" })
  );
  expect(result).toBe(true);

  result = await test.database.create(
    Object.assign({}, user1, { email: "tom@tom.com" })
  );
  expect(result).toBe(false);
  let read = await test.database.findById(1);
  expect(await test.database.count()).toBe(1);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe(hash);
    expect(read.firstName).toBe(user0.firstName);
    expect(read.email).toBe("tom@tom.com");
    expect(read.role).toBe(user0.role);
    expect(read.devices).toBeFalsy();
  }
  await cleanup(test);
});

test("Should find many users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  let u0 = await test.database.create(user0);
  let u1 = await test.database.create(user1);
  let search = await test.database.find({ where: { role: 0 } });
  expect(search.length).toBe(2);
  expect(search[0].firstName).toEqual(user0.firstName);
  expect(search[1].firstName).toEqual(user1.firstName);
  await cleanup(test);
});

test("Should find all users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  let u0 = await test.database.create(user0);
  let u1 = await test.database.create(user1);
  let search = await test.database.find();
  expect(search.length).toBe(2);
  expect(search[0].firstName).toEqual(user0.firstName);
  expect(search[1].firstName).toEqual(user1.firstName);
  await cleanup(test);
});

test("Should find user by email (case insensitive)", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  let service = test.database as UserService;
  test.utils.crypto.hash.mockImplementation(async () => hash);
  await test.database.create(user0);
  await test.database.create(user1);
  let search = await service.findByEmail(user0.email.toUpperCase());
  expect(search).toBeTruthy();
  if (search) expect(search.firstName).toBe(user0.firstName);
  await cleanup(test);
});

test("Should not find user by email (case insensitive)", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  let service = test.database as UserService;
  test.utils.crypto.hash.mockImplementation(async () => hash);
  await test.database.create(user0);
  await test.database.create(user1);
  let search = await service.findByEmail("bad@email.com");
  expect(search).toBeFalsy();
  await cleanup(test);
});

test("Should not find a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  let u = await test.database.create(user);
  let read = await test.database.findById(2);
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  let u = await test.database.create(user);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ firstName: user.firstName });
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should remove a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  await test.database.create(user);

  let u = await test.database.findById(1);
  expect(u).toBeTruthy();
  if (u) {
    expect(await test.database.count()).toBe(1);
    let result = await test.database.remove(u.id);
    expect(await test.database.count()).toBe(0);
  }

  await cleanup(test);
});

test("Should not remove a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  let u = await test.database.create(user);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ firstName: "NOT FOUND" });
  expect(await test.database.count()).toBe(1);

  await cleanup(test);
});

test("Should update a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  await test.database.create(user);

  // Check initial user
  let u = await test.database.findById(1);
  expect(u).toBeTruthy();
  if (u) expect(u.firstName).toBe(user.firstName);

  // Check updated user
  await test.database.update(
    { firstName: user.firstName },
    { firstName: "Updated" }
  );
  let search = await test.database.find({ where: { firstName: "Updated" } });
  expect(search.length).toBe(1);
  expect(search[0].firstName).toBe("Updated");

  await cleanup(test);
});

test("Should update a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  await test.database.create(user);

  // Check initial user
  let u = await test.database.findById(1);
  expect(u).toBeTruthy();
  if (u) {
    expect(u.firstName).toBe(user.firstName);
    await test.database.update(u.id, { firstName: "Updated" });
  }

  let search = await test.database.find({ where: { firstName: "Updated" } });
  expect(search.length).toBe(1);
  expect(search[0].firstName).toBe("Updated");

  await cleanup(test);
});

test("Should not update a user with invalid properties", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  await test.database.create(user0);
  let result = await test.database.update(
    { email: user0.email },
    { email: "bad" }
  );
  let u = await test.database.findById(1);
  expect(u).toBeTruthy();
  if (u) expect(u.email).toBe(user0.email);

  await cleanup(test);
});

test("Should update a user with valid properties", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => hash);
  await test.database.create(user0);
  let result = await test.database.update(
    { email: user0.email },
    { email: "VALID@gmail.com" }
  );
  let u = await test.database.findById(1);
  expect(u).toBeTruthy();
  if (u) expect(u.email).toBe("valid@gmail.com");

  await cleanup(test);
});
