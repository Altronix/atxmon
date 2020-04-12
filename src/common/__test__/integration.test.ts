import "jest";
import { SYMBOLS } from "../ioc/constants";
import { Container } from "inversify";
import { UtilRoutines } from "../types";

import containerModule from "../ioc/container";
const container = new Container();
container.load(containerModule);
const utils = container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES);

test("Should validate", async () => {
  let salt = await utils.crypto.salt();
  let hash = await utils.crypto.hash("test password 123", salt);
  expect(await utils.crypto.validate("test password 123", hash)).toBe(true);
});

test("Should invalidate", async () => {
  let salt = await utils.crypto.salt();
  let hash = await utils.crypto.hash("test password 123", salt);
  expect(await utils.crypto.validate("test password foo", hash)).toBe(false);
});
