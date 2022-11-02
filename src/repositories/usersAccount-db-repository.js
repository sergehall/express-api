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
exports.UsersAccountRepository = void 0;
const UsersAccountsSchemaModel_1 = require("../mongoose/UsersAccountsSchemaModel");
class UsersAccountRepository {
    createUserAccount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield UsersAccountsSchemaModel_1.MyModelUserAccount.create(user);
                return user;
            }
            catch (e) {
                console.log(e.toString());
                return null;
            }
        });
    }
    findUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            let filterLogin = {};
            if (searchLoginTerm) {
                filterLogin = { "accountData.login": { $regex: searchLoginTerm.toString() } };
            }
            let filterEmail = {};
            if (searchEmailTerm) {
                filterEmail = { "accountData.email": { $regex: searchEmailTerm.toString() } };
            }
            const startIndex = (pageNumber - 1) * pageSize;
            const users = yield UsersAccountsSchemaModel_1.MyModelUserAccount.find({ $and: [filterLogin, filterEmail] }, {
                _id: false,
                __v: false,
                "accountData.passwordHash": false,
                "accountData.passwordSalt": false,
                emailConfirmation: false,
                registrationData: false
            }).limit(pageSize).skip(startIndex).lean();
            const totalCount = yield UsersAccountsSchemaModel_1.MyModelUserAccount.countDocuments({ $and: [filterLogin, filterEmail] });
            const pagesCount = Math.ceil(totalCount / pageSize);
            let desc = 1;
            let asc = -1;
            let field = "createdAt";
            if (sortDirection === "asc") {
                desc = -1;
                asc = 1;
            }
            if (sortBy === "email" || sortBy === "login" || sortBy === "id") {
                field = sortBy;
            }
            let usersSort = [];
            function byField(field, asc, desc) {
                return (a, b) => a.accountData[field] > b.accountData[field] ? asc : desc;
            }
            if (users.length !== 0) {
                usersSort = users.sort(byField(field, asc, desc));
            }
            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: usersSort.map(i => i.accountData)
            };
        });
    }
    findByLoginAndEmail(email, login) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOne({ $and: [{ "accountData.email": email }, { "accountData.login": login }] });
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOne({ $or: [{ "accountData.login": loginOrEmail }, { "accountData.email": loginOrEmail }] });
        });
    }
    findByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOne({
                "emailConfirmation.confirmationCode": code,
                "emailConfirmation.isConfirmed": false,
                "emailConfirmation.expirationDate": { $gt: new Date().toISOString() }
            });
        });
    }
    getUserAccountByEmailCode(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOne({
                "emailConfirmation.confirmationCode": code,
                "accountData.email": email
            });
        });
    }
    getUserAccountByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOne({ "emailConfirmation.confirmationCode": code });
        });
    }
    findByIpAndSentEmail(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.countDocuments({
                "registrationData.ip": ip,
                "emailConfirmation.sentEmail.sendTime": { $gt: new Date(Date.now() - 1000 * 10).toISOString() }
            });
        });
    }
    updateUserAccount(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.updateOne({ "accountData.id": user.accountData.id }, { $set: user });
        });
    }
    updateUserAccountConfirmationCode(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOneAndUpdate({ "accountData.email": user.accountData.email }, { $set: user });
        });
    }
    deleteSendTimeOlderMinute(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // redo it so that it does not delete the entire user
            const result = yield UsersAccountsSchemaModel_1.MyModelUserAccount.deleteMany({
                "accountData.id": user.accountData.id,
                "emailConfirmation.sentEmail.sendTime": { $lt: new Date(Date.now() - 1000 * 60).toISOString() }
            });
            return result.deletedCount;
        });
    }
    deleteUserAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = {};
            if (id) {
                filter = { "accountData.id": id };
            }
            const result = yield UsersAccountsSchemaModel_1.MyModelUserAccount.deleteOne(filter);
            return result.acknowledged && result.deletedCount === 1;
        });
    }
    findByIsConfirmedAndCreatedAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield UsersAccountsSchemaModel_1.MyModelUserAccount.deleteMany({
                "emailConfirmation.isConfirmed": false,
                "registrationData.createdAt": { $lt: new Date(Date.now() - 1000 * 60).toISOString() }
            }); // We delete users who have not confirmed their email within 1 hour = - 1000 * 60 * 60
            return result.deletedCount;
        });
    }
    findUserByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersAccountsSchemaModel_1.MyModelUserAccount.findOne({ "accountData.id": userId });
        });
    }
}
exports.UsersAccountRepository = UsersAccountRepository;
//# sourceMappingURL=usersAccount-db-repository.js.map