import {
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  Pagination, UserType,
} from "../types/types";
import {MyModelUser} from "../mongoose/UsersSchemaModel";


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

  async findUsers(searchLoginTerm: string | null, searchEmailTerm: string | null, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null): Promise<Pagination> {

    const startIndex = (pageNumber - 1) * pageSize

    let filterLogin = {}
    if (searchLoginTerm) {
      filterLogin = {"accountData.login": searchLoginTerm}
    }
    let filterEmail = {}
    if (searchEmailTerm) {
      filterEmail = {"accountData.email": searchEmailTerm}
    }

    const direction = sortDirection === "desc" ? -1 : 1;

    let field = "createdAt"
    if (sortBy === "accountData.login" || sortBy === "accountData.email") {
      field = sortBy
    }

    const users = await MyModelUser.find(
      {
        $and: [
          filterLogin,
          filterEmail
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
      .limit(pageSize)
      .skip(startIndex)
      .sort({[field]: direction}).lean()

    const totalCount = await MyModelUser.countDocuments({$and: [filterLogin, filterEmail]})
    const pagesCount = Math.ceil(totalCount / pageSize)

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users
    }
  }

  async findByLoginAndEmail(email: string, login: string): Promise<UserType | null> {
    return await MyModelUser.findOne({$and: [{"accountData.email": email}, {"accountData.login": login}]})
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
    return await MyModelUser.findOne({$or: [{"accountData.login": {$eq: loginOrEmail}}, {"accountData.email": {$eq: loginOrEmail}}]})
  }

  async findByConfirmationCode(code: string,): Promise<UserType | null> {
    return await MyModelUser.findOne({
        "emailConfirmation.confirmationCode": code,
        "emailConfirmation.isConfirmed": false,
        "emailConfirmation.expirationDate": {$gt: new Date().toISOString()}
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
      "emailConfirmation.confirmationCode": code,
      "accountData.email": email
    })
  }

  async findUserByConfirmationCode(code: string): Promise<UserType | null> {
    return await MyModelUser.findOne({"emailConfirmation.confirmationCode": code})
  }

  async countEmailsSentLastHour(code: string): Promise<number> {
    let countSentEmails = 0;
    const currentUser: UserType | null = await MyModelUser.findOne(
      {"emailConfirmation.confirmationCode": code}
    )
    if (currentUser) {
      countSentEmails = currentUser.emailConfirmation.sentEmail.map(i => i > new Date(Date.now() - 60 * 60 * 1000).toISOString()).length
    }
    return countSentEmails
  }

  async updateUserConfirmationCode(user: UserType) {
    return await MyModelUser.findOneAndUpdate(
      {"accountData.email": user.accountData.email},
      {$set: user})
  }

  async deleteUserById(id: string): Promise<boolean> {
    const filter = {"accountData.id": id}
    const result = await MyModelUser.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

  async findByIsConfirmedAndCreatedAt(): Promise<number> {
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
