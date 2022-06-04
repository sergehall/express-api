import {UserDBType} from "../types/all_types";
import {ObjectId} from "mongodb";

const {MongoClient} = require('mongodb');
const ck = require('ckey')

describe('check functions UsersRepository', () => {
  const dbUrl = ck.ATLAS_URI
  const client = new MongoClient(dbUrl);
  const usersCollections = client.db("users").collection("users")

  const newUser = {
    "_id": new ObjectId("629af2df7db075f7e812f3ce"),
    "id": "1654309943485",
    "login": "NewLogin",
    "email": "newemail@gmail.com",
    "passwordSalt": "$2b$10$oStnneNnP6qZHhH.F8zJre",
    "passwordHash": "$2b$10$oStnneNnP6qZHhH.F8zJreC6m86C6dQAhlDn75G6n9mHrKFZumcFe",
    "createdAt": "2022-06-04T02:32:23.544Z"
  }

  beforeAll(async () => {
    try {
      await client.connect()
      await client.db('users').command({ping: 1})

    } catch (e) {
      console.log("Can't connection to Db")
      console.error(e);
      await client.close()
    }
  })

  afterAll(async () => {
    await client.close();
  });

  it('insert user in AtlasMongoDn', async () => {
    await usersCollections.insertOne(newUser);
    const insertedUser: UserDBType = await usersCollections.findOne({id: newUser.id});
    expect(insertedUser).toEqual(newUser);
    expect.assertions(1);
  });

  it('find user in AtlasMongoDn', async () => {
    const foundUser: UserDBType = await usersCollections.findOne({id: newUser.id});
    const foundUserWrongId: UserDBType = await usersCollections.findOne({id: "wrongId"});

    await expect(usersCollections.findOne({id: newUser.id})).resolves.toEqual(newUser);
    expect(foundUser).toEqual(newUser)
    expect(foundUserWrongId).toBeNull()
    expect.assertions(3);
  });

  it('find LoginOrEmail in AtlasMongoDn', async () => {
    const email = newUser.email
    const login = newUser.login
    const foundUser: UserDBType = await usersCollections.findOne({$or: [{email: email}, {login: login}]})
    const foundUserWrongEmailLogin: UserDBType = await usersCollections.findOne({$or: [{email: "wrongEmail"}, {login: "wrongLogin"}]})
    expect(foundUser).toEqual(newUser)
    expect(foundUserWrongEmailLogin).toBeNull()
    expect.assertions(2);
  });

  it('delete user in AtlasMongoDn', async () => {
    const deleted = await usersCollections.deleteOne({_id: newUser._id})
    const deletedWrongId = await usersCollections.deleteOne({_id: "wrongId"})
    expect(deleted.deletedCount).toBe(1)
    expect(deletedWrongId.deletedCount).toBe(0)
    expect.assertions(2);
  });

})