import {Pagination, UserDBType} from "../types/types";
import {MyModelUser} from "../mongoose/UsersSchemaModel";


export class UsersRepository {

  async insertUser(user: UserDBType): Promise<UserDBType | null> {
    const result = await MyModelUser.create(user)
    if (result._id) {
      return user
    }
    return null
  }

  async findUsers(pageNumber: number, pageSize: number, userName: string | null): Promise<Pagination> {
    let filter = {}
    if (userName !== null) {
      filter = {userName: {$regex: userName}}
    }

    const startIndex = (pageNumber - 1) * pageSize
    const user = await MyModelUser.find(filter, {
      projection: {
        _id: false,
        email: false,
        passwordSalt: false,
        passwordHash: false,
        createdAt: false
      }
    }).limit(pageSize).skip(startIndex).lean()

    const totalCount = await MyModelUser.countDocuments(filter)

    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: user
    }
  }

  async findUserById(id: string): Promise<UserDBType | null> {
    let user = await MyModelUser.findOne({id: id})
    if (user) {
      return user
    }
    return null
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await MyModelUser.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
  }

  async deletedUserById(id: string): Promise<boolean> {
    const result = await MyModelUser.deleteOne({id: id})
    return result.deletedCount !== 0
  }
}
