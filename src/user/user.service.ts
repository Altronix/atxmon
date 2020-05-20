import { WithOptional } from "../common/utils";
import {
  DatabaseDeepPartialEntity,
  Repository,
  DatabaseService,
  FindCriteria,
  IdCriteria
} from "../ioc/types";
import { User, UserModel, UserEntry } from "./user.model";
import { UtilRoutines } from "../common/types";
import { inject, injectable } from "inversify";
import { SYMBOLS } from "../ioc/constants.root";
import { UserEntity } from "./user.entity";

@injectable()
export class UserService implements DatabaseService<UserModel, UserEntry> {
  utils: UtilRoutines;
  repository: Repository<UserModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.ORM_REPOSITORY_USER) repository: Repository<UserEntity>
  ) {
    this.utils = utils;
    this.repository = repository;
  }

  async create(u: UserEntry): Promise<boolean> {
    // TODO call validate
    const salt = await this.utils.crypto.salt();
    const hash = await this.utils.crypto.hash(u.password, salt);
    const user = Object.assign({ tokenVersion: 0, hash, devices: [] }, u);
    user.email = user.email.toLowerCase();
    return (await this.findByEmail(u.email))
      ? false
      : this.repository.insert(user);
  }

  async findById(key: IdCriteria): Promise<UserModel | undefined> {
    return this.repository.findById(key);
  }

  async findByEmail(key: string): Promise<UserModel | undefined> {
    let query = await this.find({ email: key.toLowerCase() });
    return query.length ? query[0] : undefined;
  }

  async find(key?: FindCriteria<UserModel>): Promise<UserModel[]> {
    return this.repository.find(key);
  }

  async remove(key: FindCriteria<UserModel>): Promise<number> {
    return this.repository.remove(key);
  }

  async update(
    key: FindCriteria<UserModel>,
    next: Partial<UserModel>
  ): Promise<number> {
    if (next.email) next.email = next.email.toLowerCase();
    let insert = await User.fromPartial(next);
    return insert ? this.repository.update(key, insert) : 0;
  }

  async count(key?: FindCriteria<UserModel>): Promise<number> {
    return this.repository.count(key);
  }
}
