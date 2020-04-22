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
import { BcryptRoutines, JwtRoutines } from "../../../ioc/types";
import { Utils } from "../../../common/utils";
import { Crypto as MockCrypto } from "../../../common/crypto";
import { Logger as MockLogger } from "../../../common/logger";
import Config from "../../../config";

jest.mock("../../../common/crypto");
jest.mock("../../../common/logger");

type MockLoggerRoutines = jest.Mocked<LoggerRoutines>;
type MockCryptoRoutines = jest.Mocked<CryptoRoutines>;
export type MockUtils = {
  crypto: MockCryptoRoutines;
  logger: MockLoggerRoutines;
};

let bcrypt!: BcryptRoutines;
let jwt!: JwtRoutines;
let config!: Config;

export default () =>
  new Utils(new MockLogger(), new MockCrypto(jwt, bcrypt, config)) as MockUtils;
