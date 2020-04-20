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
import { Utils } from "../../../common/utils";
import { Bcrypt as MockBcrypt } from "../../../common/bcrypt";
import { Logger as MockLogger } from "../../../common/logger";

jest.mock("../../../common/bcrypt");
jest.mock("../../../common/logger");

type MockLoggerRoutines = jest.Mocked<LoggerRoutines>;
type MockCryptoRoutines = jest.Mocked<CryptoRoutines>;
export type MockUtils = {
  crypto: MockCryptoRoutines;
  logger: MockLoggerRoutines;
};

export default () => new Utils(new MockLogger(), new MockBcrypt()) as MockUtils;
