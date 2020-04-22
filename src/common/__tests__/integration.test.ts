import "jest";
import { UtilRoutines } from "../types";
import { SYMBOLS } from "../../ioc/common-constants";
import containerModule from "../../ioc/common-container";
import appModule from "../../ioc/app-container";
import { Container } from "inversify";

function setup() {
  const container = new Container();
  container.load(containerModule);
  container.load(appModule);
  const utils = container.get<UtilRoutines>(SYMBOLS.UTIL_ROUTINES);
  return { container, utils };
}

test("Should validate", async () => {
  let { utils } = setup();
  let salt = await utils.crypto.salt();
  let hash = await utils.crypto.hash("test password 123", salt);
  expect(await utils.crypto.validate("test password 123", hash)).toBe(true);
});

test("Should invalidate", async () => {
  let { utils } = setup();
  let salt = await utils.crypto.salt();
  let hash = await utils.crypto.hash("test password 123", salt);
  expect(await utils.crypto.validate("test password foo", hash)).toBe(false);
});

test("jwt should validate", async () => {
  let { utils } = setup();
  type Token = { sub: string; name: string; iat: number };
  let token = await utils.crypto.sign(
    `{"sub":"1234567890","name":"John Doe","iat":1516239022}`,
    "your-256-bit-secret"
  );

  let result = await utils.crypto.verify<Token>(token, "your-256-bit-secret");
  expect(result.sub).toBe("1234567890");
  expect(result.name).toBe("John Doe");
  expect(result.iat).toBe(1516239022);
});

test("jwt should invalidate", async () => {
  let { utils } = setup();
  let result = false;
  try {
    await utils.crypto.verify("foo", "your-256-bit-secret");
  } catch {
    result = true;
  }
  expect(result).toBe(true);
});

test("Should create and validate access token", async () => {
  type Hello = { hello: string };
  let { utils } = setup();
  let token = await utils.crypto.createAccessToken({ hello: "valid" });
  let decoded = await utils.crypto.decodeAndValidateAccessToken<Hello>(token);
  expect(decoded.hello).toBe("valid");
});

test("Should create and validate refresh token", async () => {
  type Hello = { hello: string };
  let { utils } = setup();
  let token = await utils.crypto.createRefreshToken({ hello: "valid" });
  let decoded = await utils.crypto.decodeAndValidateRefreshToken<Hello>(token);
  expect(decoded.hello).toBe("valid");
});

test("Should invalidate access token", async () => {
  let { utils } = setup();
  let pass = false;
  let token = await utils.crypto.createAccessToken({ hello: "valid" });
  try {
    // Decode token with the wrong key
    let decoded = await utils.crypto.decodeAndValidateRefreshToken(token);
  } catch {
    pass = true;
  }
  expect(pass).toBeTruthy();
});

test("Should invalidate refresh token", async () => {
  let { utils } = setup();
  let pass = false;
  let token = await utils.crypto.createRefreshToken({ hello: "valid" });
  try {
    // Decode token with the wrong key
    let decoded = await utils.crypto.decodeAndValidateAccessToken(token);
  } catch {
    pass = true;
  }
  expect(pass).toBeTruthy();
});
