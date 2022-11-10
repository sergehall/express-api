import {MyModelEmailsToSent} from "../mongoose/EmailsToSentSchemaModel";
import {MyModelEmailsToSentRecoveryCode} from "../mongoose/EmailsToSentRecoveryCodeShemaModel";
import {UserEmailAndConfirmationCode, UserEmailAndRecoveryCode} from "../types/types";


export class EmailsToSentRepository {
  async insertEmailToDB(emailAndCode: UserEmailAndConfirmationCode): Promise<Boolean> {
    const findOneAndReplaceData = await MyModelEmailsToSent.findOneAndReplace(
      {email: emailAndCode.email},
      {
        email: emailAndCode.email,
        code: emailAndCode.confirmationCode,
        createdAt: emailAndCode.createdAt
      },
      {upsert: true})
    return findOneAndReplaceData !== null;
  }

  async findEmailByOldestDate(): Promise<UserEmailAndConfirmationCode | null> {
    const findData = await MyModelEmailsToSent.find({}).sort({createdAt: 1})
    if (findData.length === 0) {
      return null
    }
    return findData[0]
  }

  async deleteInsertedEmailAfterSent(data: UserEmailAndConfirmationCode): Promise<boolean> {
    let filter = {}
    if (data.email) {
      filter = {email: data.email}
    }
    const result = await MyModelEmailsToSent.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

  async insertEmailToRecoveryCodesDB(emailAndCode: UserEmailAndRecoveryCode): Promise<Boolean> {
    const findOneAndReplaceData = await MyModelEmailsToSentRecoveryCode.findOneAndUpdate(
      {email: emailAndCode.email},
      {
        $set: {
          email: emailAndCode.email,
          recoveryCode: emailAndCode.recoveryCode,
          createdAt: emailAndCode.createdAt
        }
      },
      {upsert: true})
    return findOneAndReplaceData !== null;
  }

  async findEmailByOldestDateRecoveryCode(): Promise<UserEmailAndRecoveryCode | null> {
    const findData = await MyModelEmailsToSentRecoveryCode.find(
      {},
      {_id: false}).sort({createdAt: 1})
    if (findData.length === 0) {
      return null
    }
    return findData[0]
  }

  async deleteInsertedEmailAfterSentRecoveryCode(data: UserEmailAndRecoveryCode): Promise<boolean> {
    let filter = {}
    if (data.email) {
      filter = {email: data.email}
    }
    const result = await MyModelEmailsToSentRecoveryCode.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

}