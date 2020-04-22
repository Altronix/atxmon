import { Container, ContainerModule } from "inversify";
import { Server } from "../server";
import Config from "../config";
export default new ContainerModule(bind => {
  // Load app containers
  bind(Server).toSelf();
  bind(Config).toDynamicValue(() => new Config(process.argv, process.env));
});
