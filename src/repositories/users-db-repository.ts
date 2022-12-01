import {
  DTOUsers,
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  UserType,
} from "../types/tsTypes";
import {MyModelUser} from "../mongoose/UsersSchemaModel";
import {injectable} from "inversify";


@injectable()
export class UsersRepository {

  async createOrUpdateUser(user: UserType): Promise<UserType | null> {
    try {
      await MyModelUser.findOneAndUpdate(
        {"accountData.id": user.accountData.id},
        {$set: user},
        {upsert: true})
      return user
    } catch (e: any) {
      console.log(e.toString())
      return null
    }
  }

  async updateUser(user: UserType) {
    return await MyModelUser.updateOne({"accountData.id": user.accountData.id}, {$set: user})
  }

  async findUsers(dtoFindUsers: DTOUsers): Promise<UserType[]> {
    return await MyModelUser.find(
      {
        $and: [
          dtoFindUsers.filterLogin,
          dtoFindUsers.filterLogin
        ]
      },
      {
        _id: false,
        __v: false,
        "accountData.passwordHash": false,
        "accountData.passwordSalt": false,
        emailConfirmation: false,
        registrationData: false
      })
      .limit(dtoFindUsers.pageSize)
      .skip(dtoFindUsers.startIndex)
      .sort({[dtoFindUsers.field]: dtoFindUsers.direction}).lean()
  }

  async countDocuments([...filters]) {
    return await MyModelUser.countDocuments({$and: filters})
  }

  async findByLoginAndEmail(email: string, login: string): Promise<UserType | null> {
    return await MyModelUser.findOne({$and: [{"accountData.email": email}, {"accountData.login": login}]})
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
    return await MyModelUser.findOne({$or: [{"accountData.login": {$eq: loginOrEmail}}, {"accountData.email": {$eq: loginOrEmail}}]})
  }

  async findByConfirmationCode(code: string,): Promise<UserType | null> {
    return await MyModelUser.findOne(
      {
        $and: [
          {"emailConfirmation.confirmationCode": code},
          {"emailConfirmation.isConfirmed": false},
          {"emailConfirmation.expirationDate": {$gt: new Date().toISOString()}}
        ]
      },
      {
        _id: false,
        __v: false,
        "registrationData._id": false,
        "emailConfirmation.sentEmail._id": false

      })
  }

  async findUserByUserId(userId: string): Promise<UserType | null> {
    return await MyModelUser.findOne({"accountData.id": userId})
  }

  async findUserByEmailAndCode(email: string, code: string): Promise<UserType | null> {
    return await MyModelUser.findOne({
      $and:
        [
          {"emailConfirmation.confirmationCode": code},
          {"accountData.email": email}
        ]
    })
  }

  async findUserByConfirmationCode(code: string): Promise<UserType | null> {
    return await MyModelUser.findOne({"emailConfirmation.confirmationCode": code})
  }

  async updateUserConfirmationCode(user: UserType) {
    return await MyModelUser.findOneAndUpdate(
      {"accountData.email": user.accountData.email},
      {$set: user})
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await MyModelUser.deleteOne({"accountData.id": id})
    return result.acknowledged && result.deletedCount === 1;
  }

  async findByIsNotConfirmedAndCreatedAt(): Promise<number> {
    const result = await MyModelUser.deleteMany({
      "emailConfirmation.isConfirmed": false,
      "registrationData.createdAt": {$lt: new Date(Date.now() - 1000 * 60).toISOString()}
    }) // We delete users who have not confirmed their email within 1 hour = - 1000 * 60 * 60
    return result.deletedCount
  }

  async addTimeOfSentEmail(emailAndCode: EmailConfirmCodeType | EmailRecoveryCodeType): Promise<boolean> {
    return await MyModelUser.findOneAndUpdate(
      {"accountData.email": emailAndCode.email},
      {$push: {"emailConfirmation.sentEmail": new Date().toISOString()}},
      {returnDocument: "after"}).lean()
  }
}