import {emailsToSentUsersAccountCollection} from "./db";
import {UserAccountDBType} from "../types/all_types";


export class EmailsToSentRepository {
  async insertEmailToDB(user: UserAccountDBType): Promise<UserAccountDBType> {
    const foundUser = await emailsToSentUsersAccountCollection.findOne({"accountData.email": user.accountData.email})
    if (foundUser) {
      return user
    }
    await emailsToSentUsersAccountCollection.insertOne(user)
    return user
  }

  async findEmailByOldestDate(): Promise<UserAccountDBType | null> {
    // const oldestUser = await emailsToSentUsersAccountCollection.find().sort({ "emailConfirmation.sendTime" : 1 }).limit(1)
    // const findOneAndDelete = await emailsToSentUsersAccountCollection.findOneAndDelete({})
    // console.log(findOneAndDelete.ok, 'findOneAndDelete.ok')
    return await emailsToSentUsersAccountCollection.findOne({})
  }


  async deleteInsertedEmailAfterSent(user: UserAccountDBType): Promise<boolean> {
    let filter = {}
    if (user._id) {
      filter = {_id: user._id}
    }
    const result = await emailsToSentUsersAccountCollection.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

}
