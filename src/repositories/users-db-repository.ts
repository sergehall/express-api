import { usersCollection} from "./db";
import {ObjectId} from "mongodb";
import {UserDBType} from "../types/all_types";


export class UsersRepository {
  async createUser(user:UserDBType): Promise<UserDBType | null> {
    const result = await usersCollection.insertOne(user)
    if(result.acknowledged) {
      return user
    }
    return null
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
