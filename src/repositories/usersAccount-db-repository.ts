import {UserAccountDBType} from "../types/all_types";
import {ObjectId} from "mongodb";
import {MyModelUserAccount} from "../mongoose/UsersAccountsSchemaModel";


export class UsersAccountRepository {

  async createUserAccount(user: UserAccountDBType): Promise<UserAccountDBType | null> {
    const foundUser = await MyModelUserAccount.findOne({"accountData.email": user.accountData.email})
    if (foundUser) {
      return null
    }
    const result = await MyModelUserAccount.create(user)
    return user
  }

  async findAllUsers() {
    const result = await MyModelUserAccount.find({}).lean();
    return result
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBType | null> {
    const result: UserAccountDBType | null = await MyModelUserAccount.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]});
    return result
  }

  async findByLoginAndEmail(email: string, login: string): Promise<UserAccountDBType | null> {
    const result: UserAccountDBType | null = await MyModelUserAccount.findOne({$or: [{"accountData.email": email}, {"accountData.login": login}]})
    return result
  }

  async findByConfirmationCode(code: string,): Promise<UserAccountDBType | null> {
    const result: UserAccountDBType | null = await MyModelUserAccount.findOne({$and: [{"emailConfirmation.confirmationCode": code}, {"emailConfirmation.isConfirmed": false}]})
    return result
  }

  async getUserAccountByEmailCode(code: string, email: string): Promise<UserAccountDBType | null> {
    const result: UserAccountDBType | null = await MyModelUserAccount.findOne({$and: [{"emailConfirmation.confirmationCode": code}, {"accountData.email": email}]})
    return result
  }

  async getUserAccountByCode(code: string): Promise<UserAccountDBType | null> {
    const result: UserAccountDBType | null = await MyModelUserAccount.findOne({"emailConfirmation.confirmationCode": code})
    return result
  }

  async findByIpAndSentEmail(ip: string | null) {
    const result = await MyModelUserAccount.countDocuments({$and: [{"registrationData.ip": ip}, {"emailConfirmation.sentEmail.sendTime": {$gt: new Date(Date.now() - 1000 * 10)}}]})
    return result
  }

  async updateUserAccount(user: UserAccountDBType) {
    const  result = await MyModelUserAccount.updateOne({_id: new ObjectId(user._id)}, {$set: user})
    return result
  }

  async updateUserAccountConfirmationCode(user: UserAccountDBType) {
    const result = await MyModelUserAccount.findOneAndUpdate({"accountData.email": user.accountData.email}, {$set: user})
    return result
  }

  async deleteSendTimeOlderMinute(user: UserAccountDBType): Promise<number> {
    // redo it so that it does not delete the entire user
    const result = await MyModelUserAccount.deleteMany({$and: [{_id: new ObjectId(user._id)}, {"emailConfirmation.sentEmail.sendTime": {$lt: new Date(Date.now() - 1000 * 60)}}]})
    return result.deletedCount;
  }

  async deleteUserAccount(id: ObjectId): Promise<boolean> {
    let filter = {}
    if (id) {
      filter = {_id: id}
    }
    const result = await MyModelUserAccount.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

  async findByIsConfirmedAndCreatedAt(): Promise<number> {
    const result = await MyModelUserAccount.deleteMany({$and: [{"emailConfirmation.isConfirmed": false}, {"registrationData.createdAt": {$lt: new Date(Date.now() - 1000 * 60)}}]}) // We delete users who have not confirmed their email within 1 hour = - 1000 * 60 * 60
    return result.deletedCount
  }

  async findUserByObjectId(userObjectId: ObjectId): Promise<UserAccountDBType | null> {
    const result: UserAccountDBType | null = await MyModelUserAccount.findOne({_id: userObjectId})
    return result
  }
}
