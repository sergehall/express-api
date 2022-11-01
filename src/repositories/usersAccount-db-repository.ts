import {
  allUsersReturnArray, Pagination,
  UserAccountDBType,
} from "../types/all_types";
import {MyModelUserAccount} from "../mongoose/UsersAccountsSchemaModel";


export class UsersAccountRepository {

  async createUserAccount(user: UserAccountDBType): Promise<UserAccountDBType | null> {
    try {
      await MyModelUserAccount.create(user)
      return user
    } catch (e: any) {
      console.log(e.toString())
      return null
    }
  }

  async findUsers(searchLoginTerm: string | null, searchEmailTerm: string | null, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null): Promise<Pagination> {
    let filterLogin = {}
    if (searchLoginTerm) {
      filterLogin = {"accountData.login": {$regex: searchLoginTerm.toString()}}
    }
    let filterEmail = {}
    if (searchEmailTerm) {
      filterEmail = {"accountData.email": {$regex: searchEmailTerm.toString()}}
    }

    const startIndex = (pageNumber - 1) * pageSize

    const users = await MyModelUserAccount.find({$and: [filterLogin, filterEmail]}, {
      _id: false,
      __v: false,
      "accountData.passwordHash": false,
      "accountData.passwordSalt": false,
      emailConfirmation: false,
      registrationData: false

    }).limit(pageSize).skip(startIndex).lean()

    const totalCount = await MyModelUserAccount.countDocuments({$and: [filterLogin, filterEmail]})

    const pagesCount = Math.ceil(totalCount / pageSize)

    let desc = 1
    let asc = -1
    let field = "createdAt"

    if (sortDirection === "asc") {
      desc = -1
      asc = 1
    }
    if (sortBy === "email" || sortBy === "login" || sortBy === "id") {
      field = sortBy
    }

    let usersSort: allUsersReturnArray = []

    function byField(field: string, asc: number, desc: number) {
      return (a: any, b: any) => a.accountData[field] > b.accountData[field] ? asc : desc;
    }

    if (users.length !== 0) {
      usersSort = users.sort(byField(field, asc, desc))
    }

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: usersSort.map(i => i.accountData)
    }
  }

  async findByLoginAndEmail(email: string, login: string): Promise<UserAccountDBType | null> {
    return await MyModelUserAccount.findOne({$and: [{"accountData.email": email}, {"accountData.login": login}]})
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBType | null> {
    return await MyModelUserAccount.findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]})
  }

  async findByConfirmationCode(code: string,): Promise<UserAccountDBType | null> {
    return await MyModelUserAccount.findOne({
      "emailConfirmation.confirmationCode": code,
      "emailConfirmation.isConfirmed": false,
      "emailConfirmation.expirationDate": {$gt: new Date().toISOString()}
    })
  }

  async getUserAccountByEmailCode(code: string, email: string): Promise<UserAccountDBType | null> {
    return await MyModelUserAccount.findOne({
      "emailConfirmation.confirmationCode": code,
      "accountData.email": email
    })
  }

  async getUserAccountByCode(code: string): Promise<UserAccountDBType | null> {
    return await MyModelUserAccount.findOne({"emailConfirmation.confirmationCode": code})
  }

  async findByIpAndSentEmail(ip: string | null) {
    return await MyModelUserAccount.countDocuments({
      "registrationData.ip": ip,
      "emailConfirmation.sentEmail.sendTime": {$gt: new Date(Date.now() - 1000 * 10).toISOString()}
    })
  }

  async updateUserAccount(user: UserAccountDBType) {
    return await MyModelUserAccount.updateOne({"accountData.id": user.accountData.id}, {$set: user})
  }

  async updateUserAccountConfirmationCode(user: UserAccountDBType) {
    return await MyModelUserAccount.findOneAndUpdate({"accountData.email": user.accountData.email}, {$set: user})
  }

  async deleteSendTimeOlderMinute(user: UserAccountDBType): Promise<number> {
    // redo it so that it does not delete the entire user
    const result = await MyModelUserAccount.deleteMany({
      "accountData.id": user.accountData.id,
      "emailConfirmation.sentEmail.sendTime": {$lt: new Date(Date.now() - 1000 * 60).toISOString()}
    })
    return result.deletedCount;
  }

  async deleteUserAccount(id: string): Promise<boolean> {
    let filter = {}
    if (id) {
      filter = {"accountData.id": id}
    }
    const result = await MyModelUserAccount.deleteOne(filter)
    return result.acknowledged && result.deletedCount === 1;
  }

  async findByIsConfirmedAndCreatedAt(): Promise<number> {
    const result = await MyModelUserAccount.deleteMany({
      "emailConfirmation.isConfirmed": false,
      "registrationData.createdAt": {$lt: new Date(Date.now() - 1000 * 60).toISOString()}
    }) // We delete users who have not confirmed their email within 1 hour = - 1000 * 60 * 60
    return result.deletedCount
  }

  async findUserByUserId(userId: string): Promise<UserAccountDBType | null> {
    return await MyModelUserAccount.findOne({"accountData.id": userId})
  }
}
