// TODO try and use container
// IE
// @injectable
// Class MockUtils
import "jest";
import {
  LoggerRoutines,
  CryptoRoutines,
  UtilRoutines
} from "../../../common/types";
import { JwtRoutines } from "../../../ioc/types";
import { Utils } from "../../../common/utils";
import { Bcrypt as MockBcrypt } from "../../../common/bcrypt";
import { Logger as MockLogger } from "../../../common/logger";
import { Jwt as MockJwt, SignFn, VerifyFn } from "../../../common/jwt";

jest.mock("../../../common/bcrypt");
jest.mock("../../../common/logger");
jest.mock("../../../common/jwt");

type MockLoggerRoutines = jest.Mocked<LoggerRoutines>;
type MockCryptoRoutines = jest.Mocked<CryptoRoutines>;
type MockJwtRoutines = jest.Mocked<JwtRoutines>;
export type MockUtils = {
  crypto: MockCryptoRoutines;
  logger: MockLoggerRoutines;
  jwt: MockJwtRoutines;
};

let signFn!: SignFn;
let verifyFn!: VerifyFn;

export default () =>
  new Utils(
    new MockLogger(),
    new MockBcrypt(),
    new MockJwt(signFn, verifyFn)
  ) as MockUtils;
