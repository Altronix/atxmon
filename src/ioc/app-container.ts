import { Container, ContainerModule } from "inversify";
import { Server, _Server } from "../server";
import { AppAnd, AppConstructorAnd } from "../common/decorators";
import { SYMBOLS } from "./constants.root";
import Config from "../config";

type ServerConstructor = AppConstructorAnd<Server>;

export default new ContainerModule(bind => {
  bind<Server>(SYMBOLS.APP_SERVER).to(_Server as ServerConstructor);
  bind(Config).toDynamicValue(() => new Config(process.argv, process.env));
});
