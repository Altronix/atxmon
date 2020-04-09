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

type MockedLoggerRoutines = jest.Mocked<LoggerRoutines>;
type MockedCryptoRoutines = jest.Mocked<CryptoRoutines>;
type MockedUtils = {
  crypto: MockedCryptoRoutines;
  logger: MockedLoggerRoutines;
};

export default new Utils(new MockLogger(), new MockBcrypt()) as MockedUtils;
