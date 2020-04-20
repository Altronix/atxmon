import { JwtRoutines } from "../ioc/types";
import { injectable } from "inversify";

export type SignFn = (
  payload: object | string,
  secret: string,
  callback: (err: Error | null, encoded: string) => void
) => void;
export type VerifyFn = (
  token: string,
  secret: string,
  callback: (error: any, decoded: object) => void
) => void;

@injectable()
export class Jwt implements JwtRoutines {
  constructor(private signFn: SignFn, private verifyFn: VerifyFn) {}

  sign(json: object | string, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.signFn(json, key, (err, encoded) => {
        if (err) {
          reject("Bad sign");
        } else {
          resolve(encoded);
        }
      });
    });
  }

  async verify<T>(json: string, key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.verifyFn(json, key, (err, decoded) => {
        if (err) {
          reject("Bad verify");
        } else {
          resolve((decoded as any) as T);
        }
      });
    });
  }
}
