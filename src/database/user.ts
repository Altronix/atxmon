import { WithOptional } from "../common/utils";
import { Repository, Database, Criteria, UserModel, UserEntry } from "./types";
import { UtilRoutines } from "../common/types";
import { DatabaseDeepPartialEntity } from "../common/utils";
import { inject, injectable } from "inversify";
import { SYMBOLS } from "../ioc/constants";

@injectable()
export class Users implements Database<UserModel, UserEntry> {
  utils: UtilRoutines;
  repository: Repository<UserModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.REPOSITORY_USER) repository: Repository<UserModel>
  ) {
    this.utils = utils;
    this.repository = repository;
  }

  async create(u: UserEntry) {
    const salt = await this.utils.crypto.salt();
    const hash = await this.utils.crypto.hash(u.pass, salt);
    const user = Object.assign({ hash, devices: [] }, u);
    return this.repository.insert(user);
  }

  async find(key: Criteria<UserModel>): Promise<UserModel | undefined> {
    return this.repository.find(key);
  }

  async remove(key: Criteria<UserModel>): Promise<number> {
    return this.repository.remove(key);
  }

  async update(
    key: Criteria<UserModel>,
    next: DatabaseDeepPartialEntity<UserModel>
  ): Promise<number> {
    return this.repository.update(key, next);
  }

  async count(key?: Criteria<UserModel>): Promise<number> {
    return this.repository.count(key);
  }
}
