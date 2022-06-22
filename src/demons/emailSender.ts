import {emailAdapter} from "../adapters/email-adapter";
import {ioc} from "../IoCContainer";

export const emailSender = async () => {
  setTimeout(async () => {
    const emailAndCode =  await ioc.emailsToSentRepository.findEmailByOldestDate()
    if (emailAndCode !== null) {
      console.log(emailAndCode, '++++++')
      const sentEmail = await emailAdapter.sendEmailConfirmationMessage(emailAndCode)
        await ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(emailAndCode)
      if(sentEmail.accepted.length !== 0) {
        await emailSender()
      }
    }
  }, 5000)
}

