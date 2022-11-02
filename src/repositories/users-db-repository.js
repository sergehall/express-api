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
exports.UsersRepository = void 0;
const UsersSchemaModel_1 = require("../mongoose/UsersSchemaModel");
class UsersRepository {
    insertUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield UsersSchemaModel_1.MyModelUser.create(user);
            if (result._id) {
                return user;
            }
            return null;
        });
    }
    findUsers(pageNumber, pageSize, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (userName !== null) {
                filter = { userName: { $regex: userName } };
            }
            const startIndex = (pageNumber - 1) * pageSize;
            const user = yield UsersSchemaModel_1.MyModelUser.find(filter, {
                projection: {
                    _id: false,
                    email: false,
                    passwordSalt: false,
                    passwordHash: false,
                    createdAt: false
                }
            }).limit(pageSize).skip(startIndex).lean();
            const totalCount = yield UsersSchemaModel_1.MyModelUser.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: user
            };
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UsersSchemaModel_1.MyModelUser.findOne({ id: id });
            if (user) {
                return user;
            }
            return null;
        });
    }
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersSchemaModel_1.MyModelUser.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
        });
    }
    deletedUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield UsersSchemaModel_1.MyModelUser.deleteOne({ id: id });
            return result.deletedCount !== 0;
        });
    }
}
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users-db-repository.js.map