import { LinqNetwork } from "@altronix/linq-network";
import { DeviceManager, LinqDeviceManager } from "../types";
import { Linq } from "../linq";
import { SYMBOLS } from "../../ioc/constants.root";
import { ContainerModule } from "inversify";

const bindings = new ContainerModule(bind => {
  bind<DeviceManager>(SYMBOLS.DEVICE_MANAGER)
    .toDynamicValue(() => new LinqNetwork())
    .inSingletonScope();
  bind<LinqDeviceManager>(SYMBOLS.LINQ_DEVICE_MANAGER)
    .to(Linq)
    .inSingletonScope();
});

export default bindings;
