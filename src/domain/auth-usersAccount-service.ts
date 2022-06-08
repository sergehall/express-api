import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {UserAccountDBType} from "../types/all_types";
import {emailManagers} from "../managers/email-managers";
import {UsersAccountRepository} from "../repositories/usersAccount-db-repository";
import uuid4 from "uuid4";
import add from "date-fns/add";


export class AuthUsersAccountService {
  constructor(private usersAccountRepository: UsersAccountRepository) {
    this.usersAccountRepository = usersAccountRepository
  }

  async createUserRegistration(login: string, email: string, password: string, clientIp: string | null): Promise<UserAccountDBType | null> {
    const newId = uuid4();
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
        isConfirmed: false,
        sentEmail: [{sendTime: new Date()}]
      },
      registrationData: [{
        ip: clientIp,
        createdAt: [new Date()]
      }]
    }
    const createResult = await this.usersAccountRepository.createUserAccount(newUser)
    try{
      if (createResult !== null) {
        await emailManagers.sendEmailConfirmationMessage(newUser)
      }
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

  async confirmByEmail(code: string, email: string): Promise<UserAccountDBType | null> {
    const user = await this.usersAccountRepository.getUserAccountByEmailCode(code, email)
    if (user) {
      if (user.emailConfirmation.confirmationCode === code && !user.emailConfirmation.isConfirmed) {
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
      if (user.emailConfirmation.confirmationCode === code && !user.emailConfirmation.isConfirmed) {
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
    return null   //user.accountData.passwordHash === passwordHash; // true or false if not match
  }

  async checkHowManyTimesUserLoginLastHourWithSameIp(ip: string | null): Promise<number> {
    return await this.usersAccountRepository.findByIpAndTime(ip)
  }

  async deleteUserWithRottenCreatedAt(): Promise<number> {
    return await this.usersAccountRepository.findByIsConfirmedAndCreatedAt()
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
          await this.usersAccountRepository.updateUserAccountConfirmationCode(user)
          await emailManagers.sendEmailConfirmationMessage(user)
          user.emailConfirmation.sentEmail.push({sendTime: new Date()})
          await this.usersAccountRepository.updateUserAccountConfirmationCode(user)
          // await this.usersAccountRepository.deleteSendTimeOlderMinute(user)
          return user
        }
      }
    }
    return null
  }
}