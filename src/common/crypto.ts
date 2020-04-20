import { injectable } from "inversify";
import { CryptoRoutines } from "./types";
import { JwtRoutines, BcryptRoutines } from "../ioc/types";

@injectable()
export class Crypto implements CryptoRoutines {
  constructor(private jwt: JwtRoutines, private bcrypt: BcryptRoutines) {}
  hash(data: string, salt: string): Promise<string> {
    return this.bcrypt.hash(data, salt);
  }

  validate(tpass: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(tpass, hash);
  }

  salt(): Promise<string> {
    return this.bcrypt.genSalt();
  }

  sign(json: object | string, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jwt.sign(json, key, (err, encoded) => {
        if (err) {
          reject("Bad sign");
        } else {
          resolve(encoded);
        }
      });
    });
  }

  verify<T>(json: string, key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.jwt.verify(json, key, (err, decoded) => {
        if (err) {
          reject("Bad verify");
        } else {
          resolve((decoded as any) as T);
        }
      });
    });
  }
}
