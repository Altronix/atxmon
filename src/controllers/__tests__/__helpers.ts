import { setup as databaseSetup } from "../../database/__tests__/__helpers";
import { Devices } from "../../database/device";

import { Controller } from "../types";

jest.mock("../../database/device");

export async function setup() {
  // TODO instanciate a controller with a mock database service and return the
  // mock service to test interface to set spy params.
  // let test = await databaseSetup();
}
