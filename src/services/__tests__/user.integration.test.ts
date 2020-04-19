import "jest";
import { UserEntity } from "../../entities/user.entity";
import { UserEntry } from "../../models/user.model";
import { UserService } from "../user.service";
import { setup, cleanup } from "./__helpers";

const DATABASE = "user.integration.test.db";

const validUser0 = {
  name: "Thomas FOO 0",
  email: "tom0@gmail.com",
  pass: "tom0secret123456",
  role: 0
};
const validUser1 = {
  name: "Thomas FOO 1",
  email: "tom1@gmail.com",
  pass: "tom1secret123456",
  role: 0
};
const validUser = validUser0;
const hash = "development-unsafe-hash-for-test";

test("Should add a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => hash);
  let user = await test.database.create(validUser);

  expect(await test.database.count()).toBe(1);
  let read = await test.database.findById(1);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe(hash);
    expect(read.name).toBe(validUser.name);
    expect(read.email).toBe(validUser.email);
    expect(read.role).toBe(validUser.role);
    expect(read.devices).toBeFalsy;
  }
  await cleanup(test);
});

test("Should fail if user already exist", async () => {
  let result;
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => hash);
  result = await test.database.create(Object.assign({}, validUser0, { id: 0 }));
  expect(result).toBe(true);

  result = await test.database.create(Object.assign({}, validUser1, { id: 0 }));
  expect(result).toBe(false);

  let read = await test.database.findById(0);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe(hash);
    expect(read.name).toBe(validUser0.name);
    expect(read.email).toBe(validUser0.email);
    expect(read.role).toBe(validUser0.role);
    expect(read.devices).toBeFalsy;
  }
  await cleanup(test);
});

test("Should fail if user already exists by email", async () => {
  // TODO
});

test("Should find many users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let user1 = await test.database.create(validUser0);
  let user2 = await test.database.create(validUser1);
  let search = await test.database.find({ role: 0 });
  expect(search.length).toBe(2);
  expect(search[0].name).toEqual(validUser0.name);
  expect(search[1].name).toEqual(validUser1.name);
  await cleanup(test);
});

test("Should find all users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let user1 = await test.database.create(validUser0);
  let user2 = await test.database.create(validUser1);
  let search = await test.database.find();
  expect(search.length).toBe(2);
  expect(search[0].name).toEqual(validUser0.name);
  expect(search[1].name).toEqual(validUser1.name);
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
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create(validUser);
  let read = await test.database.findById(2);
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create(validUser);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ name: validUser.name });
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should remove a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create(validUser);

  let user = await test.database.findById(1);
  expect(user).toBeTruthy();
  if (user) {
    expect(await test.database.count()).toBe(1);
    let result = await test.database.remove(user.id);
    expect(await test.database.count()).toBe(0);
  }

  await cleanup(test);
});

test("Should not remove a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create(validUser);

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ name: "NOT FOUND" });
  expect(await test.database.count()).toBe(1);

  await cleanup(test);
});

test("Should update a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create(validUser);

  // Check initial user
  let user = await test.database.findById(1);
  expect(user).toBeTruthy();
  if (user) expect(user.name).toBe(validUser.name);

  // Check updated user
  await test.database.update({ name: validUser.name }, { name: "Updated" });
  let search = await test.database.find({ name: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].name).toBe("Updated");

  await cleanup(test);
});

test("Should update a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create(validUser);

  // Check initial user
  let user = await test.database.findById(1);
  expect(user).toBeTruthy();
  if (user) {
    expect(user.name).toBe(validUser.name);
    await test.database.update(user.id, { name: "Updated" });
  }

  let search = await test.database.find({ name: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].name).toBe("Updated");

  await cleanup(test);
});

test("Should update a user only with valid properties", async () => {
  // TODO
});
