import {emailAdapter} from "../adapters/email-adapter";
import {ioc} from "../IoCContainer";

export const emailConfirmationSender = async () => {
  setTimeout(async () => {
    const emailAndCode = await ioc.emailsToSentRepository.findEmailByOldestDate()
    if (emailAndCode !== null) {
      await emailAdapter.sendEmailConfirmationMessage(emailAndCode)
      await ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(emailAndCode)
    }
    await emailConfirmationSender()
  }, 5000)
}
export const emailSenderRecoveryCode = async () => {
  setTimeout(async () => {
    const emailAndCode = await ioc.emailsToSentRepository.findEmailByOldestDateRecoveryCode()
    if (emailAndCode !== null) {
      await emailAdapter.sendEmailRecoveryCode(emailAndCode)
      await ioc.emailsToSentRepository.deleteInsertedEmailAfterSentRecoveryCode(emailAndCode)
    }
    await emailSenderRecoveryCode()
  }, 5000)
}

