import {UserEmailConfirmationCode} from "../types/all_types";
import {MyModelEmailsToSent} from "../mongoose/EmailsToSentSchemaModel";


export class EmailsToSentRepository {
  async insertEmailToDB(userData: UserEmailConfirmationCode): Promise<Boolean> {
    const email = userData.email
    const confirmationCode = userData.confirmationCode
    const createdAt = userData.createdAt

    const findOneAndReplaceData = await MyModelEmailsToSent.findOneAndUpdate(
      {"email": email},
      {"email": email, "confirmationCode": confirmationCode, "createdAt": createdAt},
      {upsert: true})
    return findOneAndReplaceData !== null;
  }

  async findEmailByOldestDate(): Promise<UserEmailConfirmationCode | null> {
    const foundData = await MyModelEmailsToSent.find().sort({createdAt: 1}).limit(1)
    if (foundData.length === 0) {
      return null
    }
    return foundData[0]
  }


  async deleteInsertedEmailAfterSent(data: UserEmailConfirmationCode): Promise<boolean> {
    let filter = {}
    if (data.email) {
      filter = {email: data.email}
    }
    const result = await MyModelEmailsToSent.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

}
