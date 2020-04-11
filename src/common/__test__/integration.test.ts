import "jest";
import { utils } from "../../ioc/container.root";

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
