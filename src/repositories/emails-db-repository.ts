import {EmailConfirmCodeType, EmailRecoveryCodeType} from "../types/types";
import {MyModelEmailsConfirmCode} from "../mongoose/EmailsConfirmCodeSchemaModel";
import {MyModelEmailsRecoveryCode} from "../mongoose/EmailsRecoveryCodeShemaModel";


export class EmailsRepository {
  async insertEmailConfirmCode(emailAndCode: EmailConfirmCodeType): Promise<Boolean> {
    const findOneAndUpdateData = await MyModelEmailsConfirmCode.create(
      {
        email: emailAndCode.email,
        confirmationCode: emailAndCode.confirmationCode,
        createdAt: emailAndCode.createdAt
      })
    return findOneAndUpdateData !== null;
  }

  async findEmailByOldestDate(): Promise<EmailConfirmCodeType | null> {
    const findEmail = await MyModelEmailsConfirmCode.find(
      {},
      {_id: false})
      .sort({createdAt: 1})
      .limit(1)
    if (findEmail.length === 0) {
      return null
    }
    return findEmail[0]
  }

  async deleteEmailConfirmCodeAfterSent(emailAndCode: EmailConfirmCodeType): Promise<boolean> {
    const result = await MyModelEmailsConfirmCode.deleteOne(
      {
        $and:
          [{
            email: emailAndCode.email,
            confirmationCode: emailAndCode.confirmationCode
          }]
      })
    return result.acknowledged && result.deletedCount === 1;
  }

  async insertEmailRecoveryCode(emailAndCode: EmailRecoveryCodeType): Promise<Boolean> {
    const findOneAndUpdateData = await MyModelEmailsRecoveryCode.create(
      {
        email: emailAndCode.email,
        recoveryCode: emailAndCode.recoveryCode,
        createdAt: emailAndCode.createdAt
      })
    return findOneAndUpdateData !== null;
  }

  async findEmailByOldestDateRecoveryCode(): Promise<EmailRecoveryCodeType | null> {
    const findData = await MyModelEmailsRecoveryCode.find(
      {},
      {_id: false})
      .sort({createdAt: 1})
      .limit(1)
    if (findData.length === 0) {
      return null
    }
    return findData[0]
  }

  async deleteEmailRecoveryCodeAfterSent(emailAndCode: EmailRecoveryCodeType): Promise<boolean> {
    const result = await MyModelEmailsRecoveryCode.deleteOne(
      {
        $and:
          [{
            email: emailAndCode.email,
            recoveryCode: emailAndCode.recoveryCode
          }]
      })
    return result.acknowledged && result.deletedCount === 1;
  }

}