import { Config, Environment } from "./common/types";

export function load(args: string[], environment?: any): Config {
  let env: Environment = environment;
  return { env };
}
export default load;
