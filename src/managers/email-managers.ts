import {emailAdapter} from "../adapters/email-adapter";



export const emailManagers = {
  async doSendEmailSimple(email: string, subject: string, text: string) {
    await emailAdapter.sendEmail(email,  subject, text);
  },
  async sendEmailRecoveryPassword(user: object, token: string) {
    await emailAdapter.sendEmailRecoveryPassword(user, token);
  },
  async doSomethingElse() {
    // save to repository
    // get user from repository
    // do something with user sent or received
  }
};