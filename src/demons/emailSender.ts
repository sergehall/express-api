import {emailAdapter} from "../adapters/email-adapter";
import {ioc} from "../IoCContainer";

export const emailSender = async () => {
  setTimeout(async () => {
    const email =  await ioc.emailsToSentRepository.findEmailByOldestDate()
    if (email !== null) {
      await emailAdapter.sendEmailConfirmationMessage(email)
      await ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(email)
    }
    emailSender()
  }, 5000)
}

