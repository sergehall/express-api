import {ioc} from "../IoCContainer";


export const emailManagers = {
  async doSendEmailSimple(email: string, subject: string, text: string) {
    await ioc.emailAdapter.sendEmail(email,  subject, text);
  },
  async sendEmailRecoveryPassword(user: object, token: string) {
    await ioc.emailAdapter.sendEmailRecoveryPassword(user, token);
  },
  async doSomethingElse() {
    // save to repository
    // get user from repository
    // do something with user sent or received
  }
};