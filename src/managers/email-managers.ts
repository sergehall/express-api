import {UserType} from "../types/tsTypes";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";
import {EmailsAdapter} from "../adapters/email-adapter";

@injectable()
export class EmailManagers {
  constructor(@inject(TYPES.EmailsAdapter) protected emailsAdapter: EmailsAdapter) {
  }

  async doSendEmailSimple(email: string, subject: string, text: string) {
    await this.emailsAdapter.sendEmail(email, subject, text);
  }

  async sendEmailRecoveryPassword(user: UserType, token: string) {
    await this.emailsAdapter.sendCodeByRecoveryPassword(user, token);
  }

  async doSomethingElse() {
    // save to repository
    // get user from repository
    // do something with user sent or received
  }
}