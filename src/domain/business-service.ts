import {EmailManagers} from "../managers/email-managers";
import {UserType} from "../types/tsTypes";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";

@injectable()
export class BusinessService{
  constructor(@inject(TYPES.EmailManagers) protected emailManagers: EmailManagers) {
  }
  async doSendEmailSimple(email: string, subject: string, text: string) {
    await this.emailManagers.doSendEmailSimple(email, subject, text);
  }
  async sendEmailRecoveryPassword(user: UserType, token: string) {
    // save to repository
    // get user from repository
    await this.emailManagers.sendEmailRecoveryPassword(user, token);
  }
  async doSomethingElse() {
    // save to repository
    // get user from repository
    // do something with user sent or received
  }
}