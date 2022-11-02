"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const IoCContainer_1 = require("../IoCContainer");
exports.securityDevicesRouter = (0, express_1.Router)({});
exports.securityDevicesRouter.get('/devices', IoCContainer_1.ioc.jwtService.checkRefreshTokenInBlackListAndVerify, IoCContainer_1.ioc.securityDevicesController.getAllDevices.bind(IoCContainer_1.ioc.securityDevicesController))
    .delete('/devices', IoCContainer_1.ioc.jwtService.checkRefreshTokenInBlackListAndVerify, IoCContainer_1.ioc.securityDevicesController.deleteAllDevicesExceptCurrent.bind(IoCContainer_1.ioc.securityDevicesController))
    .delete('/devices/:deviceId', IoCContainer_1.ioc.jwtService.checkRefreshTokenInBlackListAndVerify, IoCContainer_1.ioc.securityDevicesController.deleteDeviceByDeviceId.bind(IoCContainer_1.ioc.securityDevicesController));
//# sourceMappingURL=securityDevices-router.js.map