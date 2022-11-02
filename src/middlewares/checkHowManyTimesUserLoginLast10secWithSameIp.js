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
exports.CheckHowManyTimesUserLoginLast10sec = void 0;
const request_ip_1 = __importDefault(require("request-ip"));
const IoCContainer_1 = require("../IoCContainer");
class CheckHowManyTimesUserLoginLast10sec {
    withSameIpRegConf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientIp = request_ip_1.default.getClientIp(req);
            const countRegistrationAttempts = yield IoCContainer_1.ioc.usersIPLast10secRepositories.findByIpAndTimeRegConf(clientIp);
            if (countRegistrationAttempts <= 5) {
                next();
                return;
            }
            res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.');
            return;
        });
    }
    withSameIpReg(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientIp = request_ip_1.default.getClientIp(req);
            const countRegistrationAttempts = yield IoCContainer_1.ioc.usersIPLast10secRepositories.findByIpAndTimeReg(clientIp);
            if (countRegistrationAttempts <= 5) {
                next();
                return;
            }
            res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.');
            return;
        });
    }
    withSameIpLog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientIp = request_ip_1.default.getClientIp(req);
            const countRegistrationAttempts = yield IoCContainer_1.ioc.usersIPLast10secRepositories.findByIpAndTimeLog(clientIp);
            if (countRegistrationAttempts <= 5) {
                next();
                return;
            }
            res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.');
            return;
        });
    }
    withSameIpRegEmailRes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientIp = request_ip_1.default.getClientIp(req);
            const countRegistrationAttempts = yield IoCContainer_1.ioc.usersIPLast10secRepositories.findByIpAndTimeRegEmailRes(clientIp);
            if (countRegistrationAttempts <= 5) {
                next();
                return;
            }
            res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.');
            return;
        });
    }
    withSameIpNewPasswordReq(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientIp = request_ip_1.default.getClientIp(req);
            const countRegistrationAttempts = yield IoCContainer_1.ioc.usersIPLast10secRepositories.findSameIpNewPasswordReq(clientIp);
            if (countRegistrationAttempts <= 5) {
                next();
                return;
            }
            res.status(429).send('More than 5 registration attempts from one IP-address during 10 seconds.');
            return;
        });
    }
}
exports.CheckHowManyTimesUserLoginLast10sec = CheckHowManyTimesUserLoginLast10sec;
//# sourceMappingURL=checkHowManyTimesUserLoginLast10secWithSameIp.js.map