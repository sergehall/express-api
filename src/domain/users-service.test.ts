import {UserDBType} from "../types/all_types";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";

describe('tests UsersService', () => {
  it('create user', async () => {
    const newId = Math.round((+new Date() + +new Date()) / 2).toString();
    const userFromBody = {
      "login": "NewLogin",
      "email": "newemail@gmail.com",
      "password": "123456789"
    }
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(userFromBody.password, passwordSalt)

    const newUser: UserDBType = {
      id: newId,
      login: userFromBody.login,
      email: userFromBody.email,
      passwordSalt,
      passwordHash,
      createdAt: new Date().toISOString()
    }

    expect(newUser.passwordSalt).toBe(passwordSalt)
    expect(newUser.passwordHash).toBe(passwordHash)
    expect(Object.keys(newUser).length).toBe(7)

  })
})