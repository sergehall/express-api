import {usersAccountCollection} from "./db";
import {UserAccountDBType} from "../types/all_types";
import {ObjectId} from "mongodb";


export class UsersAccountRepository {
  async createUserAccount(user: UserAccountDBType): Promise<UserAccountDBType> {
    const foundToUpdate = await usersAccountCollection.findOne({"accountData.email": user.accountData.email})
    if (foundToUpdate && !foundToUpdate.emailConfirmation.isConfirmed) {
      await usersAccountCollection.updateOne({_id: new ObjectId(foundToUpdate._id)}, {$set:
          {"accountData.id": user.accountData.id,
            "accountData.passwordSalt": user.accountData.passwordSalt,
            "accountData.passwordHash": user.accountData.passwordHash,
            "accountData.createdAt": user.accountData.createdAt,
            "emailConfirmation.confirmationCode": user.emailConfirmation.confirmationCode,
            "emailConfirmation.expirationDate": user.emailConfirmation.expirationDate}})
      return user
    }
    // we need to finalize what to send when the user already exists
    if (foundToUpdate && foundToUpdate.emailConfirmation.isConfirmed) {
      return foundToUpdate
    }
    await usersAccountCollection.insertOne(user)
    return user
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersAccountCollection.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
  }

  async getUserAccountByEmailCode(code: string, email: string) {
    return await usersAccountCollection.findOne({$and: [{"emailConfirmation.confirmationCode": code}, {"accountData.email": email}]})
  }

  async getUserAccountByCode(code: string) {
    return await usersAccountCollection.findOne({"emailConfirmation.confirmationCode": code})
  }

  async findByIpAndTime(ip: string | null) {
    return await usersAccountCollection.countDocuments({$and: [{"registrationData.ip": ip}, {"registrationData.createdAt": {$gt: new Date(Date.now() - 1000 * 60 * 60)}}]})
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
