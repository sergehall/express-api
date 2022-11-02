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
exports.SecurityDevicesService = void 0;
class SecurityDevicesService {
    constructor(securityDevicesRepository) {
        this.securityDevicesRepository = securityDevicesRepository;
        this.securityDevicesRepository = securityDevicesRepository;
    }
    getAllDevices(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.securityDevicesRepository.getAllDevices(payload);
        });
    }
    deleteAllDevicesExceptCurrent(payloadRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.securityDevicesRepository.deleteAllDevicesExceptCurrent(payloadRefreshToken);
        });
    }
    deleteDeviceByDeviceId(deviceId, payloadRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.securityDevicesRepository.deleteDeviceByDeviceId(deviceId, payloadRefreshToken);
        });
    }
    deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.securityDevicesRepository.deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken);
        });
    }
}
exports.SecurityDevicesService = SecurityDevicesService;
//# sourceMappingURL=securityDevices-service.js.map