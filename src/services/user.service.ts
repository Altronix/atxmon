import { WithOptional } from "../common/utils";
import {
  DatabaseDeepPartialEntity,
  Repository,
  DatabaseService,
  FindCriteria,
  IdCriteria
} from "./types";
import { UserModel, UserEntry } from "../models/user.model";
import { UtilRoutines } from "../common/types";
import { inject, injectable } from "inversify";
import { SYMBOLS } from "../ioc/constants.root";
import { UserEntity } from "../entities/user.entity";

// TODO rename UsersService to free up Users Namespace
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

  async create(u: UserEntry) {
    const salt = await this.utils.crypto.salt();
    const hash = await this.utils.crypto.hash(u.pass, salt);
    const user = Object.assign({ hash, devices: [] }, u);
    return this.repository.insert(user);
  }

  async findById(key: IdCriteria): Promise<UserModel | undefined> {
    return this.repository.findById(key);
  }

  async find(key?: FindCriteria<UserModel>): Promise<UserModel[]> {
    return this.repository.find(key);
  }

  async remove(key: FindCriteria<UserModel>): Promise<number> {
    return this.repository.remove(key);
  }

  async update(
    key: FindCriteria<UserModel>,
    next: DatabaseDeepPartialEntity<UserModel>
  ): Promise<number> {
    return this.repository.update(key, next);
  }

  async count(key?: FindCriteria<UserModel>): Promise<number> {
    return this.repository.count(key);
  }
}
