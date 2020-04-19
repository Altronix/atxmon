import "jest";
import { UserEntity } from "../../entities/user.entity";
import { UserEntry } from "../../models/user.model";
import { UserService } from "../user.service";
import { setup, cleanup } from "./__helpers";

const DATABASE = "user.integration.test.db";

const user0 = {
  name: "Thomas FOO 0",
  email: "tom0@gmail.com",
  pass: "tom0secret123456",
  role: 0
};
const user1 = {
  name: "Thomas FOO 1",
  email: "tom1@gmail.com",
  pass: "tom1secret123456",
  role: 0
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
    expect(read.name).toBe(user.name);
    expect(read.email).toBe(user.email);
    expect(read.role).toBe(user.role);
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

  result = await test.database.create(Object.assign({}, user1, { id: 0 }));
  expect(result).toBe(false);

  let read = await test.database.findById(0);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe(hash);
    expect(read.name).toBe(user0.name);
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
    expect(read.name).toBe(user0.name);
    expect(read.email).toBe("tom@tom.com");
    expect(read.role).toBe(user0.role);
    expect(read.devices).toBeFalsy();
  }
  await cleanup(test);
});

test("Should find many users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let u0 = await test.database.create(user0);
  let u1 = await test.database.create(user1);
  let search = await test.database.find({ role: 0 });
  expect(search.length).toBe(2);
  expect(search[0].name).toEqual(user0.name);
  expect(search[1].name).toEqual(user1.name);
  await cleanup(test);
});

test("Should find all users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let u0 = await test.database.create(user0);
  let u1 = await test.database.create(user1);
  let search = await test.database.find();
  expect(search.length).toBe(2);
  expect(search[0].name).toEqual(user0.name);
  expect(search[1].name).toEqual(user1.name);
  await cleanup(test);
});

test("Should find user by email (case insensitive)", async () => {
  // TODO
});

test("Should not find user by email (case insensitive)", async () => {
  // TODO
});

test("Should not find a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let u = await test.database.create(user);
  let read = await test.database.findById(2);
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let u = await test.database.create(user);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ name: user.name });
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should remove a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
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
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let u = await test.database.create(user);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ name: "NOT FOUND" });
  expect(await test.database.count()).toBe(1);

  await cleanup(test);
});

test("Should update a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  await test.database.create(user);

  // Check initial user
  let u = await test.database.findById(1);
  expect(u).toBeTruthy();
  if (u) expect(u.name).toBe(user.name);

  // Check updated user
  await test.database.update({ name: user.name }, { name: "Updated" });
  let search = await test.database.find({ name: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].name).toBe("Updated");

  await cleanup(test);
});

test("Should update a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  await test.database.create(user);

  // Check initial user
  let u = await test.database.findById(1);
  expect(u).toBeTruthy();
  if (u) {
    expect(u.name).toBe(user.name);
    await test.database.update(u.id, { name: "Updated" });
  }

  let search = await test.database.find({ name: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].name).toBe("Updated");

  await cleanup(test);
});

test("Should update a user only with valid properties", async () => {
  // TODO
});
