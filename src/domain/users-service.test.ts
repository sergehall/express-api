import bcrypt from "bcrypt";
import uuid4 from "uuid4";
import {UserTestOldType} from "../types/tsTypes";

describe('tests UsersService', () => {
  it('create user', async () => {
    const newId =  uuid4().toString();
    const userFromBody = {
      "login": "NewLogin",
      "email": "newemail@gmail.com",
      "password": "123456789"
    }
    const passwordSalt = await bcrypt.genSalt(11)
    const passwordHash = await bcrypt.hash(userFromBody.password, passwordSalt)

    const newUser: UserTestOldType = {
      id: newId,
      login: userFromBody.login,
      email: userFromBody.email,
      passwordHash,
      createdAt: new Date().toISOString()
    }

    expect(newUser.passwordHash).toBe(passwordHash)
    expect(Object.keys(newUser).length).toBe(5)

  })
})
