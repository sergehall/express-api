import {usersAccountCollection} from "./db";
import {UserAccountDBType} from "../types/all_types";
import {ObjectId} from "mongodb";


export class UsersAccountRepository {
  async createUserAccount(user: UserAccountDBType): Promise<UserAccountDBType | null> {
    const foundUser = await usersAccountCollection.findOne({"accountData.email": user.accountData.email})
    if (foundUser) {
      return null
    }
    await usersAccountCollection.insertOne(user)
    return user
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersAccountCollection.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
  }

  async findByLoginAndEmail(email: string, login: string ) {
    return await usersAccountCollection.findOne({$or: [{"accountData.email": email}, {"accountData.login": login}]})
  }
  async findByConfirmationCode(code: string,) {
    return await usersAccountCollection.findOne({$and: [{"emailConfirmation.confirmationCode": code}, {"emailConfirmation.isConfirmed": false}]})
  }

  async getUserAccountByEmailCode(code: string, email: string) {
    return await usersAccountCollection.findOne({$and: [{"emailConfirmation.confirmationCode": code}, {"accountData.email": email}]})
  }

  async getUserAccountByCode(code: string) {
    return await usersAccountCollection.findOne({"emailConfirmation.confirmationCode": code})
  }

  async findByIpAndSentEmail(ip: string | null) {
    return await usersAccountCollection.countDocuments({$and: [{"registrationData.ip": ip}, {"emailConfirmation.sentEmail.sendTime": {$gt: new Date(Date.now() - 1000 * 10)}}]})
  }

  async updateUserAccount(user: UserAccountDBType) {
    return await usersAccountCollection.updateOne({_id: new ObjectId(user._id)}, {$set: user})
  }

  async updateUserAccountConfirmationCode(user: UserAccountDBType) {
    return await usersAccountCollection.updateOne({_id: new ObjectId(user._id)}, {$set: user})
  }

  async deleteSendTimeOlderMinute(user: UserAccountDBType): Promise<number> {
    // redo it so that it does not delete the entire user
    const result = await usersAccountCollection.deleteMany({$and: [{_id: new ObjectId(user._id)}, {"emailConfirmation.sentEmail.sendTime": {$lt: new Date(Date.now() - 1000 * 60)}}]})
    console.log(result.deletedCount, 'result.deletedCount')
    return result.deletedCount;
  }

  async deleteUserAccount(id: ObjectId): Promise<boolean> {
    let filter = {}
    if (id) {
      filter = {_id: id}
    }
    const result = await usersAccountCollection.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

  async findByIsConfirmedAndCreatedAt(): Promise<number> {
    const result = await usersAccountCollection.deleteMany({$and: [{"emailConfirmation.isConfirmed": false}, {"registrationData.createdAt": {$lt: new Date(Date.now() - 1000 * 60)}}]}) // We delete users who have not confirmed their email within 1 hour = - 1000 * 60 * 60
    return result.deletedCount
  }
}
