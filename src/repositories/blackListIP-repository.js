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
exports.BlackListIPRepository = void 0;
const BlackListIPSchemaModel_1 = require("../mongoose/BlackListIPSchemaModel");
class BlackListIPRepository {
    // accepts 5 registrations from the same IP and then rejects.
    checkoutIPinBlackList(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield BlackListIPSchemaModel_1.MyModelBlackListIP.findOne({ ip: ip });
            if (!foundUser) {
                const createdAt = (new Date).toISOString();
                const newIp = {
                    ip,
                    countTimes: [{
                            createdAt: createdAt
                        }]
                };
                yield BlackListIPSchemaModel_1.MyModelBlackListIP.create(newIp);
                return newIp;
            }
            const copyFoundUser = Object.assign({}, foundUser);
            copyFoundUser.countTimes.push({ createdAt: (new Date).toISOString() });
            yield BlackListIPSchemaModel_1.MyModelBlackListIP.findOneAndUpdate({ ip: ip }, {
                $set: copyFoundUser
            });
            return copyFoundUser;
        });
    }
}
exports.BlackListIPRepository = BlackListIPRepository;
//# sourceMappingURL=blackListIP-repository.js.map