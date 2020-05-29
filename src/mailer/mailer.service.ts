import { injectable, inject } from "inversify";
import { UtilRoutines } from "../common/types";
import { Mailer } from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";

interface Mail {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html: string;
}

@injectable()
export class MailerService {
  constructor(
    @inject(SYMBOLS.MAILER) private mailer: Mailer,
    @inject(SYMBOLS.UTIL_ROUTINES) private util: UtilRoutines
  ) {}

  init(key: string): MailerService {
    this.mailer.setApiKey(key);
    return this;
  }

  async send(_m: Mail | Mail[]) {
    const m = Array.isArray(_m) ? _m : [_m];
    let ret = await this.mailer.send(m);
    return ret;
  }
}
