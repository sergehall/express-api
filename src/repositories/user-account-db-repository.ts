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
}
