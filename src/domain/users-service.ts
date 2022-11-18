import {
  Pagination,
  UserType
} from "../types/types";
import uuid4 from "uuid4";
import add from "date-fns/add";
import {ioc} from "../IoCContainer";
import {UsersRepository} from "../repositories/users-db-repository";


export class UsersService {
  constructor(private usersRepository: UsersRepository) {
  }

  async findUsers(searchLoginTerm: string | null, searchEmailTerm: string | null, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: string | null): Promise<Pagination> {
    return await this.usersRepository.findUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
  }

  async createUser(login: string, email: string, password: string, clientIp: string | null, userAgent: string): Promise<UserType | null> {
    const newUser: UserType = await ioc.user.createNewUser(login, password, email, clientIp, userAgent)
    return await this.usersRepository.createOrUpdateUser(newUser)
  }

  async createUserRegistration(login: string, email: string, password: string, clientIp: string | null, userAgent: string): Promise<UserType | null> {
    const newUser: UserType = await ioc.user.createNewUser(login, password, email, clientIp, userAgent)
    const createUserInDB = await this.usersRepository.createOrUpdateUser(newUser)

    try {
      if (createUserInDB) {
        const copyCreateResult = {...createUserInDB}
        if (!copyCreateResult.accountData.email) {
          return null
        }
        const newDataUserEmailConfirmationCode = {
          email: copyCreateResult.accountData.email,
          confirmationCode: copyCreateResult.emailConfirmation.confirmationCode,
          createdAt: new Date().toISOString()
        }
        await ioc.emailsToSentRepository.insertEmailToDB(newDataUserEmailConfirmationCode)

      }
      return createUserInDB
    } catch (e) {
      console.log(e)
      await this.usersRepository.deleteUserById(newUser.accountData.id)
      return null
    }
  }

  async confirmByEmail(email: string, code: string): Promise<UserType | null> {
    const user = await this.usersRepository.findUserByEmailAndCode(email, code)
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
        if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
          user.emailConfirmation.isConfirmed = true
          const result = await this.usersRepository.updateUser(user)
          if (result.matchedCount !== 1) {
            return null
          }
          return user
        }
      }
    }
    return null
  }

  async confirmByCodeInParams(code: string): Promise<UserType | null> {

    const user = await this.usersRepository.findUserByConfirmationCode(code)
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
        if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
          user.emailConfirmation.isConfirmed = true
          await this.usersRepository.updateUser(user)
          return user
        }
      }
    }
    return null
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
    return await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
  }

  async findByConfirmationCode(code: string): Promise<UserType | null> {
    return await this.usersRepository.findByConfirmationCode(code)
  }

  async countEmailsSentLastHour(code: string): Promise<number> {
    return await this.usersRepository.countEmailsSentLastHour(code)
  }

  async deleteUserWithRottenCreatedAt(): Promise<number> {
    return await this.usersRepository.findByIsConfirmedAndCreatedAt()
  }

  async sentRecoveryCodeByEmailUserExist(user: UserType) {

    await ioc.emailsToSentRepository.insertEmailToRecoveryCodesDB({
      email: user.accountData.email,
      recoveryCode: user.emailConfirmation.confirmationCode,
      createdAt: new Date().toISOString()
    })
    return user
  }

  async sentRecoveryCodeByEmailUserNotExist(email: string) {

    const newEmailRecoveryCode = {
      email: email,
      recoveryCode: uuid4().toString(),
      createdAt: new Date().toISOString()
    }
    await ioc.emailsToSentRepository.insertEmailToRecoveryCodesDB(newEmailRecoveryCode)
    return newEmailRecoveryCode
  }

  async updateAndSentConfirmationCodeByEmail(email: string) {

    const user = await this.usersRepository.findUserByLoginOrEmail(email)
    if (!user) {
      return null
    }
    if (!user.emailConfirmation.isConfirmed) {
      if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
        user.emailConfirmation.confirmationCode = uuid4().toString()
        user.emailConfirmation.expirationDate = add(new Date(),
          {
            hours: 1,
            minutes: 5
          }).toString()
        // update user
        await this.usersRepository.updateUserConfirmationCode(user)

        const newDataUserEmailConfirmationCode = {
          email: user.accountData.email,
          confirmationCode: user.emailConfirmation.confirmationCode,
          createdAt: new Date().toISOString()
        }
        // add Email to emailsToSentRepository
        await ioc.emailsToSentRepository.insertEmailToDB(newDataUserEmailConfirmationCode)
        return user
      }
    }
  }

  async findUserByUserId(userId: string): Promise<UserType | null> {
    return await this.usersRepository.findUserByUserId(userId)
  }

  async findByLoginAndEmail(email: string, login: string): Promise<UserType | null> {
    return await this.usersRepository.findByLoginAndEmail(email, login)
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUserById(id)
  }

  async addTimeOfSentEmail(email: string, sentTime: string): Promise<boolean> {
    return await this.usersRepository.addTimeOfSentEmail(email, sentTime)
  }

  async createNewPassword(newPassword: string, user: UserType) {
    const newHash = await ioc.user.createNewHash(newPassword)
    const newUser: UserType = JSON.parse(JSON.stringify(user))
    newUser.accountData.passwordHash = newHash
    return await this.usersRepository.createOrUpdateUser(newUser)
  }

}