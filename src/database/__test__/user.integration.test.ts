import "jest";
import { UserEntity } from "../orm/entities/user.entity";
import { Users } from "../user";
import { setup, cleanup } from "./_helpers";

const DATABASE = "user.integraton.test.db";

test("Should add a user", async () => {
  let test = await setup(UserEntity, Users, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  let read = await test.database.find("name", "Thomas FOO");
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe("foo secret hash");
    expect(read.name).toBe("Thomas FOO");
    expect(read.role).toBe(0);
    expect(read.devices).toBeFalsy;
  }
  await test.connection.close();
});

test("Should not find a user", async () => {
  let test = await setup(UserEntity, Users, DATABASE);
  test.utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await test.database.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  let read = await test.database.find("name", "NOT FOUND");
  expect(read).toBeFalsy();
  await test.connection.close();
});
