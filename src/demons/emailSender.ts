import {ioc} from "../IoCContainer";


export class EmailsSender {

  async sendAndDeleteConfirmationCode() {
    setTimeout(async () => {
      const emailAndCode = await ioc.emailsRepository.findEmailByOldestDate()
      if (emailAndCode) {
        await ioc.emailsAdapter.sendCodeByRegistration(emailAndCode)
        await ioc.usersService.addTimeOfSentEmail(emailAndCode)
        await ioc.emailsRepository.deleteEmailConfirmCodeAfterSent(emailAndCode)
      }
      await ioc.emailsSender.sendAndDeleteConfirmationCode()
    }, 5000)
  }

  async sendAndDeleteRecoveryCode() {
    setTimeout(async () => {
      const emailAndCode = await ioc.emailsRepository.findEmailByOldestDateRecoveryCode()
      if (emailAndCode) {
        await ioc.emailsAdapter.sendCodeByPasswordRecovery(emailAndCode)
        await ioc.usersService.addTimeOfSentEmail(emailAndCode)
        await ioc.emailsRepository.deleteEmailRecoveryCodeAfterSent(emailAndCode)
      }
      await ioc.emailsSender.sendAndDeleteRecoveryCode()
    }, 5000)
  }
}


