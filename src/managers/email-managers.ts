import {emailAdapter} from "../adapters/email-adapter";
import {UserAccountDBType} from "../types/all_types";


export const emailManagers = {
  async doSendEmailSimple(email: string, subject: string, text: string) {
    await emailAdapter.sendEmail(email,  subject, text);
  },
  async sendEmailRecoveryPassword(user: object, token: string) {
    await emailAdapter.sendEmailRecoveryPassword(user, token);
  },
  async sendEmailConfirmationMessage(user: UserAccountDBType) {
    await emailAdapter.sendEmailConfirmationMessage(user);
  },
  async doSomethingElse() {
    // save to repository
    // get user from repository
    // do something with user sent or received
  }
};