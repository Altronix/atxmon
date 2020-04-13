import { injectable, decorate, Container } from "inversify";
import { SYMBOLS } from "../../../ioc/constants.root";
import { LinqNetwork as DeviceManager } from "@altronix/linq-network";
jest.mock("@altronix/linq-network");

// Note jest.mock removes @injectable() decorator
decorate(injectable(), DeviceManager);

export default (container: Container): Container => {
  container.rebind<DeviceManager>(SYMBOLS.DEVICE_MANAGER).to(DeviceManager);
  return container;
};
