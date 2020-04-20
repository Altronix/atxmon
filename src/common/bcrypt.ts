import { injectable } from "inversify";
import bcrypt from "bcrypt";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";
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

  sign(json: object | string, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwtSign(json, key, (err, encoded) => {
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
      jwtVerify(json, key, (err, decoded) => {
        if (err) {
          reject("Bad verify");
        } else {
          resolve((decoded as any) as T);
        }
      });
    });
  }
}
