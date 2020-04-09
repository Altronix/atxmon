import { injectable } from "inversify";
import bcrypt from "bcrypt";
import { CryptoRoutines } from "./types";

@injectable()
export class Bcrypt implements CryptoRoutines {
  hash(data: string, salt: string): Promise<string> {
    return bcrypt.hash(data, salt);
  }

  validate(tpass: string, hash: string): Promise<boolean> {
    return bcrypt.compare(tpass, hash);
  }

  salt(): Promise<string> {
    return bcrypt.genSalt();
  }
}
