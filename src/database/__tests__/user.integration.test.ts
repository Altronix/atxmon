import "jest";
import { UserEntity } from "../orm/entities/user.entity";
import { Users } from "../user";
import { setup, cleanup } from "./__helpers";

const DATABASE = "user.integration.test.db";

test("Should add a user", async () => {
  let test = await setup(UserEntity, Users, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  expect(await test.database.count()).toBe(1);
  let read = await test.database.find({ name: "Thomas FOO" });
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe("foo secret hash");
    expect(read.name).toBe("Thomas FOO");
    expect(read.role).toBe(0);
    expect(read.devices).toBeFalsy;
  }
  await cleanup(test);
});

test("Should not find a user", async () => {
  let test = await setup(UserEntity, Users, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  let read = await test.database.find({ name: "NOT FOUND" });
  expect(read).toBeFalsy();
  await cleanup(test);
});

test("Should remove a user", async () => {
  let test = await setup(UserEntity, Users, DATABASE);
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
  let test = await setup(UserEntity, Users, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  let user = await test.database.find({ name: "Thomas FOO" });
  expect(user).toBeTruthy();
  if (user) {
    expect(await test.database.count()).toBe(1);
    let result = await test.database.remove(user.id);
    expect(await test.database.count()).toBe(0);
  }

  await cleanup(test);
});

test("Should not remove a user", async () => {
  let test = await setup(UserEntity, Users, DATABASE);
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
  let test = await setup(UserEntity, Users, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  // Check initial user
  let user = await test.database.find({ name: "Thomas FOO" });
  expect(user).toBeTruthy();
  if (user) expect(user.name).toBe("Thomas FOO");

  // Check updated user
  await test.database.update({ name: "Thomas FOO" }, { name: "Updated" });
  user = await test.database.find({ name: "Updated" });
  expect(user).toBeTruthy();
  if (user) expect(user.name).toBe("Updated");

  await cleanup(test);
});

test("Should update a user by ID", async () => {
  let test = await setup(UserEntity, Users, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  // Check initial user
  let user = await test.database.find({ name: "Thomas FOO" });
  expect(user).toBeTruthy();
  if (user) {
    expect(user.name).toBe("Thomas FOO");
    await test.database.update(user.id, { name: "Updated" });
  }

  user = await test.database.find({ name: "Updated" });
  expect(user).toBeTruthy();
  if (user) expect(user.name).toBe("Updated");

  await cleanup(test);
});
