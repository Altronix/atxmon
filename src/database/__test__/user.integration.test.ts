import "jest";
import * as fs from "fs";
import { Database, UserModel, UserEntry } from "../types";
import { NetworkedRepository, Connection, getConnection } from "../orm/typeorm";
import { UserEntity } from "../orm/entities/user.entity";
import { UtilRoutines } from "../../common/types";
import utils from "./__mocks__/utils.mock";
import { Users } from "../user";

const DATABASE = "user.integraton.test.db";
let connection!: Connection;
let users!: Database<UserModel, UserEntry>;
let repository!: NetworkedRepository<UserEntity>;

async function unlinkDatabase(db: string) {
  let ret: void | null;
  try {
    ret = (await fs.promises.stat(db)) ? await fs.promises.unlink(db) : null;
  } catch (e) {
    // console.log(e); // probably ENOENT
  }
  return ret;
}

beforeAll(async () => {});

afterAll(async () => {
  // Clean up our database if crash?
  await unlinkDatabase(DATABASE);
});

beforeEach(async () => {
  // All tests start with an empty database
  await unlinkDatabase(DATABASE);
  connection = await getConnection({ database: DATABASE });
  const repo = connection.getRepository<UserEntity>(UserEntity);
  repository = new NetworkedRepository(utils, repo);
  users = new Users(utils, repository);
});

afterEach(async () => {
  await unlinkDatabase(DATABASE);
  await connection.close();
});

test("Should add a user", async () => {
  utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await users.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  let read = await users.find("name", "Thomas FOO");
  expect(read).toBeTruthy();
  if (read) {
    expect(read.hash).toBe("foo secret hash");
    expect(read.name).toBe("Thomas FOO");
    expect(read.role).toBe(0);
    expect(read.devices).toBeFalsy;
  }
});

test("Should not find a user", async () => {
  utils.crypto.hash.mockImplementationOnce(async () => "foo secret hash");
  let user = await users.create({
    name: "Thomas FOO",
    pass: "secret",
    role: 0
  });

  let read = await users.find("name", "NOT FOUND");
  expect(read).toBeFalsy();
});
