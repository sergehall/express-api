import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {Pagination, UserDBType} from "../types/all_types";
import {UsersRepository} from "../repositories/users-db-repository";




export class UsersService {
  constructor(private userRepository: UsersRepository ) {
    this.userRepository = userRepository
  }
  async createUser(login: string, email: string, password: string): Promise<UserDBType | null> {
    const newId = Math.round((+new Date()+ +new Date())/2).toString();
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserDBType = {
      _id: new ObjectId(),
      id: newId,
      userName: login,
      email,
      passwordSalt,
      passwordHash,
      createdAt: new Date()
    }
    return this.userRepository.createUser(newUser)
  }

  async findUsers(pageNumber: number, pageSize: number, userName: string | null): Promise<Pagination> {
    return  await this.userRepository.findUsers(pageNumber, pageSize, userName)
  }

  async findUser(mongoId: ObjectId): Promise<UserDBType | null> {
    return  await this.userRepository.findUserById(mongoId)
  }

  async checkCredentials(loginOrEmail: string, password:string) {
    const user = await this.userRepository.findByLoginOrEmail(loginOrEmail)
    if(!user){
      return false
    }
    const passwordHash = await this._generateHash(password, user.passwordSalt)
    const result = passwordHash === user.passwordHash
    if (result) {
      return user
    }
    return false   //.passwordHash === passwordHash; // true or false if not match
  }
  async _generateHash(password: string, salt: string) {
    const  hash = await bcrypt.hash(password, salt)
    return hash
  }
  async deleteUserById(id: string): Promise<Boolean> {
    return await this.userRepository.deletedUserById(id)
  }
}