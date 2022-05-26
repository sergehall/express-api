import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {UserAccountDBType} from "../types/all_types";
import {emailManagers} from "../managers/email-managers";
import {UsersAccountRepository} from "../repositories/user-account-db-repository";
import uuid4 from "uuid4";
import add from "date-fns/add";


export class AuthService {
  constructor(private usersAccountRepository: UsersAccountRepository) {
    this.usersAccountRepository = usersAccountRepository
  }

  async createUserRegistration(login: string, email: string, password: string): Promise<UserAccountDBType | null> {
    const newId = Math.round((+new Date() + +new Date()) / 2).toString();
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserAccountDBType = {
      _id: new ObjectId(),
      accountData: {
        id: newId,
        login: login,
        email,
        passwordSalt,
        passwordHash,
        createdAt: new Date()
      },
      emailConfirmation: {
        confirmationCode: uuid4(),
        expirationDate: add(new Date(),
          {
            hours: 1,
            minutes: 5
          }),
        isConfirmed: false
      }
    }
    const createResult = await this.usersAccountRepository.createUserAccount(newUser)
    try{
      await emailManagers.sendEmailConfirmationMessage(newUser)
    }catch (e) {
      console.log(e)
      await this.usersAccountRepository.deleteUserAccount(newUser._id)
      return null
    }
    return createResult
  }

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  async confirmEmail(code: string, email: string): Promise<UserAccountDBType | null> {
    const user = await this.usersAccountRepository.getUserAccountByEmailCode(code, email)
    if (user) {
      if (user.emailConfirmation.confirmationCode === code) {
        if (user.emailConfirmation.expirationDate > new Date()) {
          user.emailConfirmation.isConfirmed = true
          await this.usersAccountRepository.updateUserAccount(user)
          return user
        }
      }
    }
    return null
  }

  async confirmByCode(code: string): Promise<UserAccountDBType | null> {
    const user = await this.usersAccountRepository.getUserAccountByCode(code)
    if (user) {
      if (user.emailConfirmation.confirmationCode === code) {
        if (user.emailConfirmation.expirationDate > new Date()) {
          user.emailConfirmation.isConfirmed = true
          await this.usersAccountRepository.updateUserAccount(user)
          return user
        }
      }
    }
    return null
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersAccountRepository.findByLoginOrEmail(loginOrEmail)
    if (user === null) {
      return null
    }
    const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
    const result = passwordHash === user.accountData.passwordHash
    if (result) {
      return user
    }
    return null   //.passwordHash === passwordHash; // true or false if not match
  }
}