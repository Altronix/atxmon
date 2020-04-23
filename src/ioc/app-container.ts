import { Container, ContainerModule } from "inversify";
import { Server } from "../server";
import { AppAnd, AppConstructorAnd } from "../common/decorators";
import { SYMBOLS } from "./constants.root";
import Config from "../config";

type AppServer = AppAnd<Server>;
type AppServerConstructor = AppConstructorAnd<Server>;

export default new ContainerModule(bind => {
  bind<AppServer>(SYMBOLS.APP_SERVER).to(Server as AppServerConstructor);
  bind(Config).toDynamicValue(() => new Config(process.argv, process.env));
});
