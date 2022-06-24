import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {UserAccountDBType} from "../types/all_types";
import {UsersAccountRepository} from "../repositories/usersAccount-db-repository";
import uuid4 from "uuid4";
import add from "date-fns/add";
import {ioc} from "../IoCContainer";


export class UsersAccountService {
  constructor(private usersAccountRepository: UsersAccountRepository) {
    this.usersAccountRepository = usersAccountRepository
  }

  async createUserRegistration(login: string, email: string, password: string, clientIp: string | null): Promise<UserAccountDBType | null> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserAccountDBType = {
      _id: new ObjectId(),
      accountData: {
        id: uuid4(),
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
        isConfirmed: false,
        sentEmail: [{sendTime: new Date()}]
      },
      registrationData: [{
        ip: clientIp,
        createdAt: new Date()
      }]
    }
    const createResult = await this.usersAccountRepository.createUserAccount(newUser)
    try{
      if (createResult !== null) {
        const newDataUserEmailConfirmationCode = {
          email: newUser.accountData.email,
          confirmationCode: newUser.emailConfirmation.confirmationCode,
          createdAt: new Date()
        }
        await ioc.emailsToSentRepository.insertEmailToDB(newDataUserEmailConfirmationCode)

      }
    }catch (e) {
      console.log(e)
      await this.usersAccountRepository.deleteUserAccount(newUser._id)
      return null
    }
    return createResult
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }

  async confirmByEmail(code: string, email: string): Promise<UserAccountDBType | null> {
    const user = await this.usersAccountRepository.getUserAccountByEmailCode(code, email)
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
        if (user.emailConfirmation.expirationDate > new Date()) {
          user.emailConfirmation.isConfirmed = true
          await this.usersAccountRepository.updateUserAccount(user)
          return user
        }
      }
    }
    return null
  }

  async confirmByCodeInParams(code: string): Promise<UserAccountDBType | null> {

    const user = await this.usersAccountRepository.getUserAccountByCode(code)
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
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
    // const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
    const result = await bcrypt.compare(password, user.accountData.passwordHash)
    if (result) {
      return user
    }
    return null   //user.accountData.passwordHash === passwordHash; // true or false if not match
  }

  async findByLoginAndEmail(email: string, login: string): Promise<UserAccountDBType | null> {
    return await this.usersAccountRepository.findByLoginAndEmail(email, login)
  }

  async findByConfirmationCode(code: string): Promise<UserAccountDBType | null> {
    return await this.usersAccountRepository.findByConfirmationCode(code)
  }

  async checkHowManyTimesUserLoginLastHourSentEmail(ip: string | null): Promise<number> {
    return await this.usersAccountRepository.findByIpAndSentEmail(ip)
  }

  async deleteUserWithRottenCreatedAt(): Promise<number> {
    return await this.usersAccountRepository.findByIsConfirmedAndCreatedAt()
  }
  async findUserByObjectId(userObjectId: ObjectId): Promise<UserAccountDBType | null> {
    return await this.usersAccountRepository.findUserByObjectId(userObjectId)
  }

  async updateAndSentConfirmationCodeByEmail(email: string) {

    const user = await this.usersAccountRepository.findByLoginOrEmail(email)
    if (user === null) {
      return null
    }
    if (user.emailConfirmation.sentEmail.length > 20) {
      return null
    }
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
        if (user.emailConfirmation.expirationDate > new Date()) {
          user.emailConfirmation.confirmationCode = uuid4()
          user.emailConfirmation.expirationDate = add(new Date(),
            {
              hours: 1,
              minutes: 5
            })
          const newDataUserEmailConfirmationCode = {
            email: user.accountData.email,
            confirmationCode: user.emailConfirmation.confirmationCode,
            createdAt: new Date()
          }
          await ioc.emailsToSentRepository.insertEmailToDB(newDataUserEmailConfirmationCode)
          user.emailConfirmation.sentEmail.push({sendTime: new Date()})
          await this.usersAccountRepository.updateUserAccountConfirmationCode(user)
          return user
        }
      }
    }
    return null
  }

  async updateAndSentConfirmationCode(email: string, password: string) {

    const user = await this.usersAccountRepository.findByLoginOrEmail(email)
    if (user === null) {
      return null
    }
    if (user.emailConfirmation.sentEmail.length > 5) {
      return null
    }
    const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
    const result = passwordHash === user.accountData.passwordHash
    if (result === null) {
      return null
    }
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
        if (user.emailConfirmation.expirationDate > new Date()) {
          user.emailConfirmation.confirmationCode = uuid4()
          user.emailConfirmation.expirationDate = add(new Date(),
            {
              hours: 1,
              minutes: 5
            })
          const newDataUserEmailConfirmationCode = {
            email: user.accountData.email,
            confirmationCode: user.emailConfirmation.confirmationCode,
            createdAt: new Date()
          }
          await ioc.emailsToSentRepository.insertEmailToDB(newDataUserEmailConfirmationCode)
          user.emailConfirmation.sentEmail.push({sendTime: new Date()})
          await this.usersAccountRepository.updateUserAccountConfirmationCode(user)
          return user
        }
      }
    }
    return null
  }
}