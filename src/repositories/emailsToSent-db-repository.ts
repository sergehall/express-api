import {emailsToSentUsersAccountCollection} from "./db";
import {UserEmailConfirmationCode} from "../types/all_types";


export class EmailsToSentRepository {
  async insertEmailToDB(userData: UserEmailConfirmationCode): Promise<Boolean> {
    const email = userData.email
    const confirmationCode = userData.confirmationCode
    const createdAt = userData.createdAt

    const findOneAndReplaceData = await emailsToSentUsersAccountCollection.findOneAndReplace({"email": email}, {"email": email, "confirmationCode": confirmationCode, "createdAt": createdAt},  {upsert: true})
    return findOneAndReplaceData.ok === 1
  }

  async findEmailByOldestDate(): Promise<UserEmailConfirmationCode | null> {
    const foundData = await emailsToSentUsersAccountCollection.find({}).sort({ "createdAt" : 1 }).limit(1).toArray()
    if(foundData.length === 0) {
      return null
    }
    return foundData[0]
  }


  async deleteInsertedEmailAfterSent(data: UserEmailConfirmationCode): Promise<boolean> {
    let filter = {}
    if (data.email) {
      filter = {email: data.email}
    }
    const result = await emailsToSentUsersAccountCollection.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

}
