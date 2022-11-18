import {ioc} from "../IoCContainer";


export class EmailSender {

  async sendAndDeleteConfirmationCode() {
    setTimeout(async () => {
      const emailAndCode = await ioc.emailsToSentRepository.findEmailByOldestDate()
      if (emailAndCode !== null) {
        await ioc.emailAdapter.sendEmailConfirmationMessage(emailAndCode)
        await ioc.usersService.addTimeOfSentEmail(emailAndCode.email, new Date().toISOString())
        await ioc.emailsToSentRepository.deleteInsertedEmailAfterSent(emailAndCode)
      }
      await ioc.emailSender.sendAndDeleteConfirmationCode()
    }, 5000)
  }

  async sendAndDeleteRecoveryCode() {
    setTimeout(async () => {
      const emailAndCode = await ioc.emailsToSentRepository.findEmailByOldestDateRecoveryCode()
      if (emailAndCode !== null) {
        await ioc.emailAdapter.sendEmailRecoveryCode(emailAndCode)
        await ioc.usersService.addTimeOfSentEmail(emailAndCode.email, new Date().toISOString())
        await ioc.emailsToSentRepository.deleteInsertedEmailAfterSentRecoveryCode(emailAndCode)
      }
      await ioc.emailSender.sendAndDeleteRecoveryCode()
    }, 5000)
  }
}


