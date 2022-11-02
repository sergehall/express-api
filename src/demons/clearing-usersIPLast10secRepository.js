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
exports.ClearingIpWithDateOlder11Sec = void 0;
const Last10secRegConfModel_1 = require("../mongoose/Last10secRegConfModel");
const Last10secRegModel_1 = require("../mongoose/Last10secRegModel");
const Last10secRegEmailResModel_1 = require("../mongoose/Last10secRegEmailResModel");
const Last10secLogModel_1 = require("../mongoose/Last10secLogModel");
const IoCContainer_1 = require("../IoCContainer");
const Last10secNewPassResModel_1 = require("../mongoose/Last10secNewPassResModel");
class ClearingIpWithDateOlder11Sec {
    // runs every 2 minutes
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield Last10secRegConfModel_1.MyModeLast10secRegConf.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 10).toISOString() } });
                yield Last10secRegModel_1.MyModeLast10secReg.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 10).toISOString() } });
                yield Last10secLogModel_1.MyModeLast10secLog.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 10).toISOString() } });
                yield Last10secRegEmailResModel_1.MyModeLast10secRedEmailRes.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 10).toISOString() } });
                yield Last10secNewPassResModel_1.MyModeRedLast10secNewPasswordReq.deleteMany({ createdAt: { $lt: new Date(Date.now() - 1000 * 10).toISOString() } });
                yield IoCContainer_1.ioc.clearingIpWithDateOlder11Sec.start();
            }), 60000);
        });
    }
}
exports.ClearingIpWithDateOlder11Sec = ClearingIpWithDateOlder11Sec;
//# sourceMappingURL=clearing-usersIPLast10secRepository.js.map