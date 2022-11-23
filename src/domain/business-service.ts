import {emailManagers} from "../managers/email-managers";
import {UserType} from "../types/types";


export const businessService = {

  async doSendEmailSimple(email: string, subject: string, text: string) {
    await emailManagers.doSendEmailSimple(email, subject, text);
  },
  async sendEmailRecoveryPassword(user: UserType, token: string) {
    // save to repository
    // get user from repository
    await emailManagers.sendEmailRecoveryPassword(user, token);
  },
  async doSomethingElse() {
    // save to repository
    // get user from repository
    // do something with user sent or received
  }
};