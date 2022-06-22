import {emailAdapter} from "../adapters/email-adapter";
import {ioc} from "../IoCContainer";

export const emailSender = async () => {
  setTimeout(async () => {
    const user =  await ioc.emailsToSentRepository.findEmailByOldestDate()
    if (user !== null) {
      await emailAdapter.sendEmailConfirmationMessage(user)
      await ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(user)
    }
    emailSender()
  }, 3000)
}

