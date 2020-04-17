import "jest";
import { UserEntity } from "../../entities/user.entity";
import { UserEntry } from "../../models/user.model";
import { UserService } from "../user.service";
import { setup, cleanup } from "./__helpers";

const DATABASE = "user.integration.test.db";

test("Should add a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  expect(await test.database.count()).toBe(1);
  let read = await test.database.findById(1);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe("foo secret hash");
    expect(read.name).toBe("Thomas FOO");
    expect(read.role).toBe(0);
    expect(read.devices).toBeFalsy;
  }
  await cleanup(test);
});

test("Should fail if user already exist", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let result = await test.database.create({
    id: 0,
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  } as UserEntry);
  expect(result).toBe(true);

  result = await test.database.create({
    id: 0,
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  } as UserEntry);
  expect(result).toBe(false);

  let read = await test.database.findById(0);
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe("foo secret hash");
    expect(read.name).toBe("Thomas FOO");
    expect(read.role).toBe(0);
    expect(read.devices).toBeFalsy;
  }
  await cleanup(test);
});

test("Should find many users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let user1 = await test.database.create({
    name: "Thomas FOO 1",
    pass: "secret",
    role: 0
  });
  let user2 = await test.database.create({
    name: "Thomas FOO 2",
    pass: "secret",
    role: 0
  });
  let search = await test.database.find({ role: 0 });
  expect(search.length).toBe(2);
  expect(search[0].name).toEqual("Thomas FOO 1");
  expect(search[1].name).toEqual("Thomas FOO 2");
  await cleanup(test);
});

test("Should find all users", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementation(async () => "foo secret hash");
  let user1 = await test.database.create({
    name: "Thomas FOO 1",
    pass: "secret",
    role: 0
  });
  let user2 = await test.database.create({
    name: "Thomas FOO 2",
    pass: "secret",
    role: 0
  });
  let search = await test.database.find();
  expect(search.length).toBe(2);
  expect(search[0].name).toEqual("Thomas FOO 1");
  expect(search[1].name).toEqual("Thomas FOO 2");
  await cleanup(test);
});

test("Should not find a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  let read = await test.database.findById(2);
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ name: "Thomas FOO" });
  expect(await test.database.count()).toBe(0);

  await cleanup(test);
});

test("Should remove a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

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
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  expect(await test.database.count()).toBe(1);
  let result = await test.database.remove({ name: "NOT FOUND" });
  expect(await test.database.count()).toBe(1);

  await cleanup(test);
});

test("Should update a user", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  // Check initial user
  let user = await test.database.findById(1);
  expect(user).toBeTruthy();
  if (user) expect(user.name).toBe("Thomas FOO");

  // Check updated user
  await test.database.update({ name: "Thomas FOO" }, { name: "Updated" });
  let search = await test.database.find({ name: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].name).toBe("Updated");

  await cleanup(test);
});

test("Should update a user by ID", async () => {
  let test = await setup(UserEntity, UserService, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  // Check initial user
  let user = await test.database.findById(1);
  expect(user).toBeTruthy();
  if (user) {
    expect(user.name).toBe("Thomas FOO");
    await test.database.update(user.id, { name: "Updated" });
  }

  let search = await test.database.find({ name: "Updated" });
  expect(search.length).toBe(1);
  expect(search[0].name).toBe("Updated");

  await cleanup(test);
});
