import {usersCollection} from "./db";
import {ObjectId} from "mongodb";
import {Pagination, UserDBType} from "../types/all_types";


export class UsersRepository {
  async createUser(user: UserDBType): Promise<UserDBType | null> {
    const result = await usersCollection.insertOne(user)
    if (result.acknowledged && result) {
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
    const user = await usersCollection.find(filter, {
      projection: {
        _id: false,
        email: false,
        passwordSalt: false,
        passwordHash: false,
        createdAt: false
      }
    }).limit(pageSize).skip(startIndex).toArray()

    const totalCount = await usersCollection.countDocuments(filter)

    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: user
    }
  }

  async findUserById(id: ObjectId): Promise<UserDBType | null> {
    let user = await usersCollection.findOne({_id: id})
    if (user) {
      return user
    }
    return null
  }

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersCollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
  }

  async deletedUserById(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({id: id})
    return result.deletedCount !== 0
  }
}
