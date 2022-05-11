import { usersCollection} from "./db";
import {ObjectId} from "mongodb";
import {UserDBType} from "../types/all_types";


export class UserRepository {
  async createUser(user:UserDBType): Promise<UserDBType> {
    const result = await usersCollection.insertOne(user)
    return user
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
}
