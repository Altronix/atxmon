import { LinqNetwork } from "@altronix/linq-network";
import { LinqManager } from "../types";
import { Linq } from "../linq";
import { SYMBOLS } from "../../ioc/constants.root";
import { ContainerModule } from "inversify";

const bindings = new ContainerModule(bind => {
  bind<LinqManager>(SYMBOLS.LINQ_MANAGER)
    .toDynamicValue(() => new LinqNetwork())
    .inSingletonScope();
  bind<Linq>(Linq)
    .toSelf()
    .inSingletonScope();
});

export default bindings;
