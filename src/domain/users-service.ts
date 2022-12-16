import {
  DTOUsers,
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  Pagination, SortOrder,
  UserType
} from "../types/tsTypes";
import uuid4 from "uuid4";
import add from "date-fns/add";
import bcrypt from "bcrypt";
import {inject, injectable} from "inversify";
import {TYPES} from "../types/types";
import {EmailsRepository} from "../repositories/emails-db-repository";
import {UsersRepository} from "../repositories/users-db-repository";


const ck = require('ckey')


@injectable()
export class UsersService {
  constructor(
    @inject(TYPES.UsersRepository) protected usersRepository: UsersRepository,
    @inject(TYPES.EmailsRepository) protected emailsRepository: EmailsRepository) {
  }

  async findUsers(searchLoginTerm: string | null, searchEmailTerm: string | null, pageNumber: number, pageSize: number, sortBy: string | null, sortDirection: SortOrder): Promise<Pagination> {
    console.log(searchLoginTerm, searchEmailTerm)
    const queryArr = [searchLoginTerm, searchEmailTerm]
    const filters = [];
    for (let i = 0, l = queryArr.length; i < l; i++) {
      if (queryArr[i] && queryArr[i] === searchLoginTerm) {
        filters.push({"accountData.login": {$regex: searchLoginTerm}});
      } else if (queryArr[i] && queryArr[i] === searchEmailTerm) {
        filters.push({"accountData.email": {$regex: searchEmailTerm}});
      }
    }
    if (filters.length === 0) {
      filters.push({})
    }
    
    const startIndex = (pageNumber - 1) * pageSize
    const direction = sortDirection;
    let field = "createdAt"

    if (sortBy === "login" || sortBy === "email") {
      field = "accountData." + sortBy
    }
    const dtoFindUsers: DTOUsers = {
      filters,
      pageSize,
      startIndex,
      field,
      direction
    }

    const users = await this.usersRepository.findUsers(dtoFindUsers)

    const countDocuments = await this.usersRepository.countDocuments(filters)

    const pagesCount = Math.ceil(countDocuments / pageSize)
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: countDocuments,
      items: users
    }
  }

  async createUser(login: string, email: string, password: string, clientIp: string | null, userAgent: string): Promise<UserType | null> {
    const newUser: UserType = await this._createNewUser(login, password, email, clientIp, userAgent)
    return await this.usersRepository.createOrUpdateUser(newUser)
  }

  async createUserRegistration(login: string, email: string, password: string, clientIp: string | null, userAgent: string): Promise<UserType | null> {
    const newUser: UserType = await this._createNewUser(login, password, email, clientIp, userAgent)
    const createUser = await this.usersRepository.createOrUpdateUser(newUser)
    try {
      if (!createUser) {
        return null
      }
      const newDataUserEmailConfirmationCode = {
        email: createUser.accountData.email,
        confirmationCode: createUser.emailConfirmation.confirmationCode,
        createdAt: new Date().toISOString()
      }
      await this.emailsRepository.insertEmailConfirmCode(newDataUserEmailConfirmationCode)

      return createUser

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
    let countSentEmails = 0;
    const currentUser: UserType | null = await this.usersRepository.findUserByConfirmationCode(code)
    if (currentUser) {
      countSentEmails = currentUser.emailConfirmation.sentEmail.map(i => i > new Date(Date.now() - 60 * 60 * 1000).toISOString()).length
    }
    return countSentEmails
  }

  async deleteUserWithRottenCreatedAt(): Promise<number> {
    return await this.usersRepository.findByIsNotConfirmedAndCreatedAt()
  }

  async sentRecoveryCodeByEmailUserExist(user: UserType) {

    await this.emailsRepository.insertEmailRecoveryCode({
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
    await this.emailsRepository.insertEmailRecoveryCode(newEmailRecoveryCode)
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
        await this.emailsRepository.insertEmailConfirmCode(newDataUserEmailConfirmationCode)
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

  async addTimeOfSentEmail(emailAndCode: EmailConfirmCodeType | EmailRecoveryCodeType): Promise<boolean> {
    return await this.usersRepository.addTimeOfSentEmail(emailAndCode)
  }

  async createNewPassword(newPassword: string, user: UserType) {
    const passwordSalt = await bcrypt.genSalt(Number(ck.SALT_FACTOR))
    const newHash = await this._generateHash(newPassword, passwordSalt)
    const newUser: UserType = JSON.parse(JSON.stringify(user))
    newUser.accountData.passwordHash = newHash
    return await this.usersRepository.createOrUpdateUser(newUser)
  }

  async _createNewUser(login: string, password: string, email: string, ip: string | null, userAgent: string) {
    const passwordSalt = await bcrypt.genSalt(Number(ck.SALT_FACTOR))
    const passwordHash = await this._generateHash(password, passwordSalt)
    const id = uuid4().toString()
    const currentTime = new Date().toISOString()
    const confirmationCode = uuid4().toString()
    const expirationDate = add(new Date(),
      {
        hours: 1,
        minutes: 5
      }).toISOString()

    return {
      accountData: {
        id: id,
        login: login,
        email: email,
        passwordHash: passwordHash,
        createdAt: currentTime
      },
      emailConfirmation: {
        confirmationCode: confirmationCode,
        expirationDate: expirationDate,
        isConfirmed: false,
        sentEmail: []
      },
      registrationData: {
        ip: ip,
        userAgent: userAgent
      }
    };
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }

}