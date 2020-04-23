import { injectable } from "inversify";
import { CryptoRoutines } from "./types";
import { Config } from "../common/types";
import { JwtRoutines, BcryptRoutines } from "../ioc/types";

@injectable()
export class Crypto implements CryptoRoutines {
  constructor(
    private jwt: JwtRoutines,
    private bcrypt: BcryptRoutines,
    private config: Config
  ) {}

  hash(data: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.bcrypt.hash(data, salt, (err, enc) => {
        if (!err) {
          resolve(enc);
        } else {
          reject(err);
        }
      });
    });
  }

  validate(tpass: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.bcrypt.compare(tpass, hash, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
  }

  salt(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.bcrypt.genSalt((err, salt) => {
        if (!err) {
          resolve(salt);
        } else {
          reject(err);
        }
      });
    });
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

  async createAccessToken(json: any): Promise<string> {
    return this.sign(json, this.config.accessTokenSecret);
  }

  async createRefreshToken(json: any): Promise<string> {
    return this.sign(json, this.config.refreshTokenSecret);
  }

  async decodeAndValidateAccessToken<T>(token: string): Promise<T> {
    return this.verify(token, this.config.accessTokenSecret);
  }

  async decodeAndValidateRefreshToken<T>(token: string): Promise<T> {
    return this.verify(token, this.config.refreshTokenSecret);
  }
}
