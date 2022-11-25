import {injectable} from "inversify";
import {container} from "../Container";
import {UsersService} from "../domain/users-service";
import {EmailsAdapter} from "../adapters/email-adapter";
import {EmailsRepository} from "../repositories/emails-db-repository";


@injectable()
export class EmailsSender {

  async sendAndDeleteConfirmationCode() {
    setTimeout(async () => {
      const emailsAdapter = container.resolve<EmailsAdapter>(EmailsAdapter)
      const usersService = container.resolve<UsersService>(UsersService)
      const emailsRepository = container.resolve<EmailsRepository>(EmailsRepository)
      const emailsSender = container.resolve<EmailsSender>(EmailsSender)

      const emailAndCode = await emailsRepository.findEmailByOldestDate()
      if (emailAndCode) {
        await emailsAdapter.sendCodeByRegistration(emailAndCode)
        await usersService.addTimeOfSentEmail(emailAndCode)
        await emailsRepository.deleteEmailConfirmCodeAfterSent(emailAndCode)
      }
      await emailsSender.sendAndDeleteConfirmationCode()
    }, 5000)
  }

  async sendAndDeleteRecoveryCode() {
    setTimeout(async () => {
      const usersService = container.resolve<UsersService>(UsersService)
      const emailsAdapter = container.resolve<EmailsAdapter>(EmailsAdapter)
      const emailsRepository = container.resolve<EmailsRepository>(EmailsRepository)
      const emailsSender = container.resolve<EmailsSender>(EmailsSender)

      const emailAndCode = await emailsRepository.findEmailByOldestDateRecoveryCode()
      if (emailAndCode) {
        await emailsAdapter.sendCodeByPasswordRecovery(emailAndCode)
        await usersService.addTimeOfSentEmail(emailAndCode)
        await emailsRepository.deleteEmailRecoveryCodeAfterSent(emailAndCode)
      }
      await emailsSender.sendAndDeleteRecoveryCode()
    }, 5000)
  }
}


