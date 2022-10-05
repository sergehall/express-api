import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {Pagination, UserDBType} from "../types/all_types";
import {UsersRepository} from "../repositories/users-db-repository";
import uuid4 from "uuid4";


export class UsersService {
  constructor(private usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async createUser(login: string, email: string, password: string): Promise<UserDBType | null> {
    const newId = uuid4().toString();
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserDBType = {
      id: newId,
      login: login,
      email,
      passwordSalt,
      passwordHash,
      createdAt: new Date().toISOString()
    }
    return this.usersRepository.insertUser(newUser)
  }

  async findUsers(pageNumber: number, pageSize: number, userName: string | null): Promise<Pagination> {
    return await this.usersRepository.findUsers(pageNumber, pageSize, userName)
  }

  async findUser(mongoId: ObjectId): Promise<UserDBType | null> {
    return await this.usersRepository.findUserById(mongoId)
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
    if (user === null) {
      return null
    }
    const result = await bcrypt.compare(password, user.passwordHash)
    if (result) {
      return user
    }
    return null   //.passwordHash === passwordHash; // true or false if not match
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }

  async deleteUserById(id: string): Promise<Boolean> {
    return await this.usersRepository.deletedUserById(id)
  }
}