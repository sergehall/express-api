import {ioc} from "../IoCContainer";
import {UserType} from "../types/types";


export const emailManagers = {

  async doSendEmailSimple(email: string, subject: string, text: string) {
    await ioc.emailsAdapter.sendEmail(email, subject, text);
  },

  async sendEmailRecoveryPassword(user: UserType, token: string) {
    await ioc.emailsAdapter.sendCodeByRecoveryPassword(user, token);
  },

  async doSomethingElse() {
    // save to repository
    // get user from repository
    // do something with user sent or received
  }
};