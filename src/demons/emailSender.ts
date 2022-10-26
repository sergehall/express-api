import {ioc} from "../IoCContainer";


export class EmailSender {

  async emailSenderConfirmationCode() {
    setTimeout(async () => {
      const emailAndCode = await ioc.emailsToSentRepository.findEmailByOldestDate()
      if (emailAndCode !== null) {
        await ioc.emailAdapter.sendEmailConfirmationMessage(emailAndCode)
        await ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(emailAndCode)
      }
      await ioc.emailSender.emailSenderConfirmationCode()
    }, 5000)
  }

  async emailSenderRecoveryCode() {
    setTimeout(async () => {
      const emailAndCode = await ioc.emailsToSentRepository.findEmailByOldestDateRecoveryCode()
      if (emailAndCode !== null) {
        await ioc.emailAdapter.sendEmailRecoveryCode(emailAndCode)
        await ioc.emailsToSentRepository.deleteInsertedEmailAfterSentRecoveryCode(emailAndCode)
      }
      await ioc.emailSender.emailSenderRecoveryCode()
    }, 5000)
  }
}


