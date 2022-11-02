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
exports.SecurityDevicesRepository = void 0;
const DevicesSchemaModel_1 = require("../mongoose/DevicesSchemaModel");
class SecurityDevicesRepository {
    getAllDevices(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DevicesSchemaModel_1.MyModelDevicesSchema.find({ userId: payload.userId, expirationDate: { $gt: new Date().toISOString() } }, {
                    _id: false,
                    __v: false,
                    userId: false,
                    expirationDate: false
                });
            }
            catch (e) {
                console.log(e);
                return [];
            }
        });
    }
    deleteAllDevicesExceptCurrent(payloadRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield DevicesSchemaModel_1.MyModelDevicesSchema.deleteMany({
                    $and: [
                        { userId: payloadRefreshToken.userId },
                        { deviceId: { $ne: payloadRefreshToken.deviceId } }
                    ]
                }).lean();
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield DevicesSchemaModel_1.MyModelDevicesSchema.deleteOne({
                    $and: [
                        { userId: payloadRefreshToken.userId },
                        { deviceId: payloadRefreshToken.deviceId }
                    ]
                });
                return "204";
            }
            catch (e) {
                return e.toString();
            }
        });
    }
    deleteDeviceByDeviceId(deviceId, payloadRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findByDeviceId = yield DevicesSchemaModel_1.MyModelDevicesSchema.findOne({ deviceId: deviceId }).lean();
                if (!findByDeviceId) {
                    return "404";
                }
                if (findByDeviceId && findByDeviceId.userId !== payloadRefreshToken.userId) {
                    return "403";
                }
                yield DevicesSchemaModel_1.MyModelDevicesSchema.deleteOne({ deviceId: deviceId });
                return "204";
            }
            catch (e) {
                return e.toString();
            }
        });
    }
}
exports.SecurityDevicesRepository = SecurityDevicesRepository;
//# sourceMappingURL=securityDevices-db-repository.js.map