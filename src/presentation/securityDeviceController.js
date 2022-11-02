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
exports.SecurityDevicesController = void 0;
const IoCContainer_1 = require("../IoCContainer");
class SecurityDevicesController {
    constructor(securityDevicesService) {
        this.securityDevicesService = securityDevicesService;
    }
    getAllDevices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const payload = IoCContainer_1.ioc.jwtService.jwt_decode(refreshToken);
            const getDevices = yield this.securityDevicesService.getAllDevices(payload);
            return res.send(getDevices);
        });
    }
    deleteAllDevicesExceptCurrent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                const payloadRefreshToken = IoCContainer_1.ioc.jwtService.jwt_decode(refreshToken);
                yield this.securityDevicesService.deleteAllDevicesExceptCurrent(payloadRefreshToken);
                return res.sendStatus(204);
            }
            catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        });
    }
    deleteDeviceByDeviceId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedId = req.params.deviceId;
                const refreshToken = req.cookies.refreshToken;
                const payloadRefreshToken = IoCContainer_1.ioc.jwtService.jwt_decode(refreshToken);
                const result = yield this.securityDevicesService.deleteDeviceByDeviceId(deletedId, payloadRefreshToken);
                if (result === "204") {
                    return res.sendStatus(204);
                }
                if (result === "404") {
                    return res.sendStatus(404);
                }
                if (result === "403") {
                    return res.sendStatus(403);
                }
                return res.send({ result: result });
            }
            catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        });
    }
}
exports.SecurityDevicesController = SecurityDevicesController;
//# sourceMappingURL=securityDeviceController.js.map