import {emailsToSentUsersAccountCollection} from "./db";
import {UserEmailConfirmationCode} from "../types/all_types";


export class EmailsToSentRepository {
  async insertEmailToDB(userData: UserEmailConfirmationCode): Promise<UserEmailConfirmationCode> {
    // const foundUser = await emailsToSentUsersAccountCollection.findOne({"accountData.email": user.accountData.email})
    const email = userData.email
    const updateUser = await emailsToSentUsersAccountCollection.findOneAndUpdate({"email": email},{$setOnInsert: {userData}}, { upsert: true })
    if (updateUser){
      console.log(userData)
      return userData
    }
    await emailsToSentUsersAccountCollection.insertOne(userData)
    return userData
  }

  async findEmailByOldestDate(): Promise<UserEmailConfirmationCode | null> {
    // const oldestUser = await emailsToSentUsersAccountCollection.find().sort({ "emailConfirmation.sendTime" : 1 }).limit(1)
    // const findOneAndDelete = await emailsToSentUsersAccountCollection.findOneAndDelete({})
    // console.log(findOneAndDelete.ok, 'findOneAndDelete.ok')
    return await emailsToSentUsersAccountCollection.findOne({})
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
