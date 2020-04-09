import { LinqNetwork } from "@altronix/linq-network";
import { LinqManager } from "../linq/types";
import { Linq } from "../linq/linq";
import { SYMBOLS } from "./constants";
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
