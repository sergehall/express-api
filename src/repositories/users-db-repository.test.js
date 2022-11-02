"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const { MongoClient } = require('mongodb');
const ck = require('ckey');
describe('check functions UsersRepository', () => {
    const dbUrl = ck.ATLAS_URI;
    const client = new MongoClient(dbUrl);
    const usersCollections = client.db("users").collection("users");
    const newUser = {
        "_id": new mongodb_1.ObjectId("629af2df7db075f7e812f3ce"),
        "id": "1654309943485",
        "login": "NewLogin",
        "email": "newemail@gmail.com",
        "passwordSalt": "$2b$10$oStnneNnP6qZHhH.F8zJre",
        "passwordHash": "$2b$10$oStnneNnP6qZHhH.F8zJreC6m86C6dQAhlDn75G6n9mHrKFZumcFe",
        "createdAt": "2022-06-04T02:32:23.544Z"
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db('users').command({ ping: 1 });
        }
        catch (e) {
            console.log("Can't connection to Db");
            console.error(e);
            yield client.close();
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close();
    }));
    it('insert user in AtlasMongoDn', () => __awaiter(void 0, void 0, void 0, function* () {
        yield usersCollections.insertOne(newUser);
        const insertedUser = yield usersCollections.findOne({ id: newUser.id });
        expect(insertedUser).toEqual(newUser);
        expect.assertions(1);
    }));
    it('find user in AtlasMongoDn', () => __awaiter(void 0, void 0, void 0, function* () {
        const foundUser = yield usersCollections.findOne({ id: newUser.id });
        const foundUserWrongId = yield usersCollections.findOne({ id: "wrongId" });
        yield expect(usersCollections.findOne({ id: newUser.id })).resolves.toEqual(newUser);
        expect(foundUser).toEqual(newUser);
        expect(foundUserWrongId).toBeNull();
        expect.assertions(3);
    }));
    it('find LoginOrEmail in AtlasMongoDn', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = newUser.email;
        const login = newUser.login;
        const foundUser = yield usersCollections.findOne({ $or: [{ email: email }, { login: login }] });
        const foundUserWrongEmailLogin = yield usersCollections.findOne({ $or: [{ email: "wrongEmail" }, { login: "wrongLogin" }] });
        expect(foundUser).toEqual(newUser);
        expect(foundUserWrongEmailLogin).toBeNull();
        expect.assertions(2);
    }));
    it('delete user in AtlasMongoDn', () => __awaiter(void 0, void 0, void 0, function* () {
        const deleted = yield usersCollections.deleteOne({ _id: newUser._id });
        const deletedWrongId = yield usersCollections.deleteOne({ _id: "wrongId" });
        expect(deleted.deletedCount).toBe(1);
        expect(deletedWrongId.deletedCount).toBe(0);
        expect.assertions(2);
    }));
});
//# sourceMappingURL=users-db-repository.test.js.map