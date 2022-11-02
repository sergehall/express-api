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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersAccountService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid4_1 = __importDefault(require("uuid4"));
const add_1 = __importDefault(require("date-fns/add"));
const IoCContainer_1 = require("../IoCContainer");
class UsersAccountService {
    constructor(usersAccountRepository) {
        this.usersAccountRepository = usersAccountRepository;
        this.usersAccountRepository = usersAccountRepository;
    }
    findUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersAccountRepository.findUsers(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection);
        });
    }
    createUser(login, email, password, clientIp) {
        return __awaiter(this, void 0, void 0, function* () {
            const newId = (0, uuid4_1.default)().toString();
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                accountData: {
                    id: newId,
                    login,
                    email,
                    passwordSalt,
                    passwordHash,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid4_1.default)().toString(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        hours: 1,
                        minutes: 5
                    }).toISOString(),
                    isConfirmed: false,
                    sentEmail: [{ sendTime: new Date().toISOString() }]
                },
                registrationData: [{
                        ip: clientIp,
                        createdAt: new Date().toISOString()
                    }]
            };
            return yield this.usersAccountRepository.createUserAccount(newUser);
        });
    }
    createNewPassword(newPassword, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(newPassword, passwordSalt);
            const newUser = JSON.parse(JSON.stringify(user));
            newUser.accountData.passwordSalt = passwordSalt;
            newUser.accountData.passwordHash = passwordHash;
            return yield this.usersAccountRepository.createUserAccount(newUser);
        });
    }
    createUserRegistration(login, email, password, clientIp) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                accountData: {
                    id: (0, uuid4_1.default)().toString(),
                    login: login,
                    email: email,
                    passwordSalt,
                    passwordHash,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid4_1.default)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        hours: 1,
                        minutes: 5
                    }).toString(),
                    isConfirmed: false,
                    sentEmail: [{ sendTime: new Date().toISOString() }]
                },
                registrationData: [{
                        ip: clientIp,
                        createdAt: new Date().toISOString()
                    }]
            };
            const createResult = yield this.usersAccountRepository.createUserAccount(newUser);
            try {
                if (createResult !== null) {
                    const copy = Object.assign({}, createResult);
                    if (!copy.accountData.email) {
                        return null;
                    }
                    const newDataUserEmailConfirmationCode = {
                        email: copy.accountData.email,
                        confirmationCode: copy.emailConfirmation.confirmationCode,
                        createdAt: new Date().toISOString()
                    };
                    yield IoCContainer_1.ioc.emailsToSentRepository.insertEmailToDB(newDataUserEmailConfirmationCode);
                }
            }
            catch (e) {
                console.log(e);
                yield this.usersAccountRepository.deleteUserAccount(newUser.accountData.id);
                return null;
            }
            return createResult;
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    confirmByEmail(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersAccountRepository.getUserAccountByEmailCode(code, email);
            if (user) {
                if (!user.emailConfirmation.isConfirmed) {
                    if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
                        user.emailConfirmation.isConfirmed = true;
                        const result = yield this.usersAccountRepository.updateUserAccount(user);
                        if (result.matchedCount !== 1) {
                            return null;
                        }
                        return user;
                    }
                }
            }
            return null;
        });
    }
    confirmByCodeInParams(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersAccountRepository.getUserAccountByCode(code);
            if (user) {
                if (!user.emailConfirmation.isConfirmed) {
                    if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
                        user.emailConfirmation.isConfirmed = true;
                        yield this.usersAccountRepository.updateUserAccount(user);
                        return user;
                    }
                }
            }
            return null;
        });
    }
    findByLoginAndEmail(email, login) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersAccountRepository.findByLoginAndEmail(email, login);
        });
    }
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersAccountRepository.findUserByLoginOrEmail(loginOrEmail);
        });
    }
    findByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersAccountRepository.findByConfirmationCode(code);
        });
    }
    checkHowManyTimesUserLoginLastHourSentEmail(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersAccountRepository.findByIpAndSentEmail(ip);
        });
    }
    deleteUserWithRottenCreatedAt() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersAccountRepository.findByIsConfirmedAndCreatedAt();
        });
    }
    findUserByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersAccountRepository.findUserByUserId(userId);
        });
    }
    sentRecoveryCodeByEmailUserExist(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IoCContainer_1.ioc.emailsToSentRepository.insertEmailToRecoveryCodesDB({
                email: user.accountData.email,
                recoveryCode: user.emailConfirmation.confirmationCode,
                createdAt: new Date().toISOString()
            });
            user.emailConfirmation.sentEmail.push({ sendTime: new Date().toISOString() });
            yield this.usersAccountRepository.updateUserAccountConfirmationCode(user);
            return user;
        });
    }
    sentRecoveryCodeByEmailUserNotExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const newEmailRecoveryCode = {
                email: email,
                recoveryCode: (0, uuid4_1.default)().toString(),
                createdAt: new Date().toISOString()
            };
            yield IoCContainer_1.ioc.emailsToSentRepository.insertEmailToRecoveryCodesDB(newEmailRecoveryCode);
            return newEmailRecoveryCode;
        });
    }
    updateAndSentConfirmationCodeByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersAccountRepository.findUserByLoginOrEmail(email);
            if (!user || !user.accountData.email) {
                return null;
            }
            if (user.emailConfirmation.sentEmail.length > 10) {
                return null;
            }
            if (user) {
                if (!user.emailConfirmation.isConfirmed) {
                    if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
                        user.emailConfirmation.confirmationCode = (0, uuid4_1.default)().toString();
                        user.emailConfirmation.expirationDate = (0, add_1.default)(new Date(), {
                            hours: 1,
                            minutes: 5
                        }).toString();
                        const newDataUserEmailConfirmationCode = {
                            email: user.accountData.email,
                            confirmationCode: user.emailConfirmation.confirmationCode,
                            createdAt: new Date().toISOString()
                        };
                        yield IoCContainer_1.ioc.emailsToSentRepository.insertEmailToDB(newDataUserEmailConfirmationCode);
                        user.emailConfirmation.sentEmail.push({ sendTime: new Date().toISOString() });
                        yield this.usersAccountRepository.updateUserAccountConfirmationCode(user);
                        return user;
                    }
                }
            }
            return null;
        });
    }
}
exports.UsersAccountService = UsersAccountService;
//# sourceMappingURL=usersAccount-service.js.map