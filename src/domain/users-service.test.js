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
const bcrypt_1 = __importDefault(require("bcrypt"));
describe('tests UsersService', () => {
    it('create user', () => __awaiter(void 0, void 0, void 0, function* () {
        const newId = Math.round((+new Date() + +new Date()) / 2).toString();
        const userFromBody = {
            "login": "NewLogin",
            "email": "newemail@gmail.com",
            "password": "123456789"
        };
        const passwordSalt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash(userFromBody.password, passwordSalt);
        const newUser = {
            id: newId,
            login: userFromBody.login,
            email: userFromBody.email,
            passwordSalt,
            passwordHash,
            createdAt: new Date().toISOString()
        };
        expect(newUser.passwordSalt).toBe(passwordSalt);
        expect(newUser.passwordHash).toBe(passwordHash);
        expect(Object.keys(newUser).length).toBe(7);
    }));
});
//# sourceMappingURL=users-service.test.js.map