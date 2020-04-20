import "jest";
import { UtilRoutines } from "../types";
import { SYMBOLS } from "../../ioc/common-constants";
import containerModule from "../../ioc/common-container";
import { Container } from "inversify";

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
