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
exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid4_1 = __importDefault(require("uuid4"));
class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.usersRepository = usersRepository;
    }
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const newId = (0, uuid4_1.default)().toString();
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                id: newId,
                login: login,
                email,
                passwordSalt,
                passwordHash,
                createdAt: new Date().toISOString()
            };
            return this.usersRepository.insertUser(newUser);
        });
    }
    findUsers(pageNumber, pageSize, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.findUsers(pageNumber, pageSize, userName);
        });
    }
    findUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.findUserById(userId);
        });
    }
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (user === null) {
                return null;
            }
            const result = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (result) {
                return user;
            }
            return null; //.passwordHash === passwordHash; // true or false if not match
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.deletedUserById(id);
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users-service.js.map