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
exports.BlackListRefreshTokenJWTRepository = void 0;
const BlackListRefreshTokenJWTModel_1 = require("../mongoose/BlackListRefreshTokenJWTModel");
class BlackListRefreshTokenJWTRepository {
    findByRefreshTokenAndUserId(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BlackListRefreshTokenJWTModel_1.MyModelBlackListRefreshTokenJWT.findOne({ "refreshToken": refreshToken });
        });
    }
    addRefreshTokenAndUserId(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield BlackListRefreshTokenJWTModel_1.MyModelBlackListRefreshTokenJWT.create({ refreshToken: refreshToken });
            return result.refreshToken;
        });
    }
}
exports.BlackListRefreshTokenJWTRepository = BlackListRefreshTokenJWTRepository;
//# sourceMappingURL=blackListRefreshTokenJWT-db-repository.js.map