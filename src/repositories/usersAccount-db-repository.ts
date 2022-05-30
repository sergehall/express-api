import {usersAccountCollection} from "./db";
import {UserAccountDBType} from "../types/all_types";
import {ObjectId} from "mongodb";


export class UsersAccountRepository {
  async createUserAccount(user: UserAccountDBType): Promise<UserAccountDBType | null> {
    const result = await usersAccountCollection.insertOne(user)
    if (result.acknowledged && result) {
      return user
    }
    return null
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersAccountCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
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
