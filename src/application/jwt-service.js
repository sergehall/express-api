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
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const IoCContainer_1 = require("../IoCContainer");
const uuid4_1 = __importDefault(require("uuid4"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const ck = require('ckey');
class JWTService {
    createUsersAccountJWT(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = (0, uuid4_1.default)().toString();
            return jsonwebtoken_1.default.sign({ userId: userId, deviceId }, ck.ACCESS_SECRET_KEY, { expiresIn: 300 });
        });
    }
    createUsersAccountRefreshJWT(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = (0, uuid4_1.default)().toString();
            return jsonwebtoken_1.default.sign({ userId: userId, deviceId }, ck.REFRESH_SECRET_KEY, { expiresIn: 600 });
        });
    }
    updateUsersAccountAccessJWT(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({
                userId: payload.userId,
                deviceId: payload.deviceId
            }, ck.ACCESS_SECRET_KEY, { expiresIn: 300 });
        });
    }
    updateUsersAccountRefreshJWT(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({
                userId: payload.userId,
                deviceId: payload.deviceId
            }, ck.REFRESH_SECRET_KEY, { expiresIn: 600 });
        });
    }
    verifyRefreshJWT(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, ck.REFRESH_SECRET_KEY);
                return result.userId;
            }
            catch (e) {
                return null;
            }
        });
    }
    verifyAccessJWT(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, ck.ACCESS_SECRET_KEY);
                return result.userId;
            }
            catch (err) {
                return null;
            }
        });
    }
    checkRefreshTokenInBlackListAndVerify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                const tokenInBlackList = yield IoCContainer_1.ioc.blackListRefreshTokenJWTRepository.findByRefreshTokenAndUserId(refreshToken);
                const userId = yield IoCContainer_1.ioc.jwtService.verifyRefreshJWT(refreshToken);
                if (tokenInBlackList || !userId) {
                    return res.sendStatus(401);
                }
                next();
                return;
            }
            catch (e) {
                console.log(e, "RefreshToken expired or incorrect");
                return res.sendStatus(401);
            }
        });
    }
    jwt_decode(token) {
        return (0, jwt_decode_1.default)(token);
    }
}
exports.JWTService = JWTService;
//# sourceMappingURL=jwt-service.js.map