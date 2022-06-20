import {emailAdapter} from "../adapters/email-adapter";
import {UserAccountDBType} from "../types/all_types";
import {ioc} from "../IoCContainer";

export const emailSender = async () => {
  setTimeout(async () => {
    const user: UserAccountDBType | null =  await ioc.emailsToSentRepository.findEmailByOldestDate()
    if (user !== null) {
      await emailAdapter.sendEmailConfirmationMessage(user)
      await ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(user)
    }
    emailSender()
  }, 1000)
}

