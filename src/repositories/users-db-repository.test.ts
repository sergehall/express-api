import {ObjectId} from "mongodb";
import {UserTestType, UserType} from "../types/tsTypes";

const {MongoClient} = require('mongodb');
const ck = require('ckey')


describe('check functions UsersRepository', () => {
  const dbUrl = ck.ATLAS_URI
  const client = new MongoClient(dbUrl);
  const usersCollections = client.db(ck.TEST_DATABASE).collection("Users")

  const newUserWithObjId: UserTestType = {
    _id: new ObjectId('63786eb0efbb69c0b6193121'),
    accountData: {
      id: "e7681294-2f73-464c-8fd9-2c1b8d0e55bd",
      login: "NewLogin",
      email: "newemail@gmail.com",
      passwordHash: "$2b$11$vx/jHIl9cJiFLjfy9cF1a.p7R1NHkW6kUefQTdXV8C71W3H.FMu6."
    },
    emailConfirmation: {
      confirmationCode: "c8aac59f-61dc-4482-91ec-83edb35d9c2c",
      expirationDate: "2022-11-19T05:40:50.481Z",
      isConfirmed: false,
      sentEmail: ["2022-06-04T02:32:23.544Z"]
    },
    registrationData: {
      ip: "::1",
      userAgent: "PostmanRuntime/7.29.2",
      createdAt: "2022-11-19T04:35:50.481Z"
    }
  }

  beforeAll(async () => {
    try {
      await client.connect()
      await client.db(ck.DB_NAME_TEST).command({ping: 1})

    } catch (e) {
      console.log("Can't connection to Db")
      console.error(e);
      await client.close()
    }
  })

  afterAll(async () => {
    const deleteUser = await usersCollections.deleteOne({"accountData.id": newUserWithObjId.accountData.id});
    await client.close();
  });

  it('insert user in AtlasMongoDn', async () => {
    const insertUser = await usersCollections.insertOne(newUserWithObjId);
    const findUser: UserType = await usersCollections.findOne({"accountData.id": newUserWithObjId.accountData.id});
    expect(findUser).toEqual(newUserWithObjId);
    expect(insertUser.acknowledged).toEqual(true);
    expect.assertions(2);
  });

  it('find user in AtlasMongoDn', async () => {
    const findUser: UserType = await usersCollections.findOne({"accountData.id": newUserWithObjId.accountData.id});
    const foundUserWrongId: UserType = await usersCollections.findOne({"accountData.id": "wrongId"});

    await expect(usersCollections.findOne({"accountData.id": newUserWithObjId.accountData.id})).resolves.toEqual(newUserWithObjId);
    expect(findUser).toEqual(newUserWithObjId)
    expect(foundUserWrongId).toBeNull()
    expect.assertions(3);
  });

  it('find LoginOrEmail in AtlasMongoDn', async () => {
    const email = newUserWithObjId.accountData.email
    const login = newUserWithObjId.accountData.login
    const foundUser: UserType = await usersCollections.findOne({$or: [{"accountData.email": email}, {"accountData.login": login}]})
    const foundUserWrongEmailLogin: UserType = await usersCollections.findOne({$or: [{"accountData.email": "wrongEmail"}, {"accountData.login": "wrongLogin"}]})
    expect(foundUser).toEqual(newUserWithObjId)
    expect(foundUserWrongEmailLogin).toBeNull()
    expect.assertions(2);
  });

  it('delete user in AtlasMongoDn', async () => {
    const deleted = await usersCollections.deleteOne({"accountData.id": newUserWithObjId.accountData.id})
    const deletedWrongId = await usersCollections.deleteOne({"accountData.id": "wrongId"})
    expect(deleted.deletedCount).toBe(1)
    expect(deletedWrongId.deletedCount).toBe(0)
    expect.assertions(2);
  });
})
