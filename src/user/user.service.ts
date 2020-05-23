import { WithOptional } from "../common/utils";
import {
  DatabaseDeepPartialEntity,
  DatabaseService,
  FindCriteria,
  IdCriteria
} from "../ioc/types";
import { OrmRepository } from "../ioc/orm.service";
import { User, UserModel, UserEntry } from "./user.model";
import { UtilRoutines } from "../common/types";
import { inject, injectable } from "inversify";
import { SYMBOLS } from "../ioc/constants.root";
import { UserEntity } from "./user.entity";

@injectable()
export class UserService implements DatabaseService<UserModel, UserEntry> {
  utils: UtilRoutines;
  orm: OrmRepository<UserModel>;
  constructor(
    @inject(SYMBOLS.UTIL_ROUTINES) utils: UtilRoutines,
    @inject(SYMBOLS.ORM_REPOSITORY_USER) orm: OrmRepository<UserEntity>
  ) {
    this.utils = utils;
    this.orm = orm;
  }

  async create(u: UserEntry): Promise<boolean> {
    // TODO call validate
    const salt = await this.utils.crypto.salt();
    const hash = await this.utils.crypto.hash(u.password, salt);
    const user = { tokenVersion: 0, hash, devices: [], ...u };
    user.email = user.email.toLowerCase();
    return (await this.findByEmail(u.email))
      ? false
      : (await this.orm.repository.insert(user))
      ? true
      : false;
  }

  async findById(key: IdCriteria): Promise<UserModel | undefined> {
    let ret = await this.orm.repository.findByIds([key]);
    return ret.length ? ret[0] : undefined;
  }

  async findByEmail(key: string): Promise<UserModel | undefined> {
    let query = await this.find({ email: key.toLowerCase() });
    return query.length ? query[0] : undefined;
  }

  async find(
    where?: FindCriteria<UserModel>,
    sort?: keyof UserModel,
    limit?: number
  ): Promise<UserModel[]> {
    let config = {};
    if (where) Object.assign(config, { where: where });
    if (sort) Object.assign(config, { order: { [`${sort}`]: "ASC" } });
    if (limit) Object.assign(config, { take: limit });
    let ret = await this.orm.repository.find(config); // ie: take:10
    return ret;
  }

  async remove(key: FindCriteria<UserModel>): Promise<number> {
    let ret = await this.orm.repository.delete(key);
    return ret.affected ? ret.affected : 0;
  }

  async update(
    key: FindCriteria<UserModel>,
    next: Partial<UserModel>
  ): Promise<number> {
    if (next.email) next.email = next.email.toLowerCase();
    let insert = await User.fromPartial(next);
    if (insert) {
      let ret = await this.orm.repository.update(key, insert);
      return ret.affected ? ret.affected : 0;
    } else {
      return 0;
    }
  }

  async count(key?: FindCriteria<UserModel>): Promise<number> {
    return this.orm.repository.count(key);
  }
}
