import uuid4 from "uuid4";
import add from "date-fns/add";
import bcrypt from "bcrypt";

const ck = require('ckey')

export class User {

  async createNewUser(login: string, password: string, email: string, ip: string | null, userAgent: string) {
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
      },
      emailConfirmation: {
        confirmationCode: confirmationCode,
        expirationDate: expirationDate,
        isConfirmed: false,
        sentEmail: []
      },
      registrationData: {
        ip: ip,
        userAgent: userAgent,
        createdAt: currentTime
      }
    }
  }

  async createNewHash(newPassword: string) {
    const passwordSalt = await bcrypt.genSalt(Number(ck.SALT_FACTOR))
    return await this._generateHash(newPassword, passwordSalt)
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }
}