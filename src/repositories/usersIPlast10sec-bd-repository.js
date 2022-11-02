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
exports.UsersIPLast10secRepositories = void 0;
const Last10secRegConfModel_1 = require("../mongoose/Last10secRegConfModel");
const Last10secRegModel_1 = require("../mongoose/Last10secRegModel");
const Last10secLogModel_1 = require("../mongoose/Last10secLogModel");
const Last10secRegEmailResModel_1 = require("../mongoose/Last10secRegEmailResModel");
const Last10secNewPassResModel_1 = require("../mongoose/Last10secNewPassResModel");
class UsersIPLast10secRepositories {
    findByIpAndTimeRegConf(clientIp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Last10secRegConfModel_1.MyModeLast10secRegConf.create({ ip: clientIp, createdAt: new Date().toISOString() });
            const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString();
            return yield Last10secRegConfModel_1.MyModeLast10secRegConf.countDocuments({ ip: clientIp, createdAt: { $gte: currentTimeMinus10sec } });
        });
    }
    findByIpAndTimeReg(clientIp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Last10secRegModel_1.MyModeLast10secReg.create({ ip: clientIp, createdAt: new Date().toISOString() });
            const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString();
            return yield Last10secRegModel_1.MyModeLast10secReg.countDocuments({ ip: clientIp, createdAt: { $gte: currentTimeMinus10sec } });
        });
    }
    findByIpAndTimeLog(clientIp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Last10secLogModel_1.MyModeLast10secLog.create({ ip: clientIp, createdAt: new Date().toISOString() });
            const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString();
            return yield Last10secLogModel_1.MyModeLast10secLog.countDocuments({ ip: clientIp, createdAt: { $gte: currentTimeMinus10sec } });
        });
    }
    findByIpAndTimeRegEmailRes(clientIp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Last10secRegEmailResModel_1.MyModeLast10secRedEmailRes.create({ ip: clientIp, createdAt: new Date().toISOString() });
            const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString();
            return yield Last10secRegEmailResModel_1.MyModeLast10secRedEmailRes.countDocuments({ ip: clientIp, createdAt: { $gte: currentTimeMinus10sec } });
        });
    }
    findSameIpNewPasswordReq(clientIp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Last10secNewPassResModel_1.MyModeRedLast10secNewPasswordReq.create({ ip: clientIp, createdAt: new Date().toISOString() });
            const currentTimeMinus10sec = new Date(Date.now() - 1000 * 10).toISOString();
            return yield Last10secNewPassResModel_1.MyModeRedLast10secNewPasswordReq.countDocuments({ ip: clientIp, createdAt: { $gte: currentTimeMinus10sec } });
        });
    }
}
exports.UsersIPLast10secRepositories = UsersIPLast10secRepositories;
//# sourceMappingURL=usersIPlast10sec-bd-repository.js.map