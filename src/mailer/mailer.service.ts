import { injectable, inject } from "inversify";
import { UtilRoutines } from "../common/types";
import { Mailer } from "../ioc/types";
import { SYMBOLS } from "../ioc/constants.root";

export interface Mail {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface MailText extends Mail {
  text: string;
}
export interface MailHtml extends Mail {
  html: string;
}

@injectable()
export class MailerService {
  valid: boolean = false;
  constructor(
    @inject(SYMBOLS.MAILER) private mailer: Mailer,
    @inject(SYMBOLS.UTIL_ROUTINES) private util: UtilRoutines
  ) {}

  init(key: string): MailerService {
    let mailer: any = this.mailer;
    this.mailer.setApiKey(key);
    this.valid = true;
    return this;
  }

  async send(_m: MailText | MailText[] | MailHtml | MailHtml[]) {
    if (this.valid) {
      const m = Array.isArray(_m) ? _m : [_m];
      let ret = await this.mailer.send(m);
      return ret;
    } else {
      this.util.logger.warn(`Cannot send email, no API KEY detected!!!`);
    }
  }
}
