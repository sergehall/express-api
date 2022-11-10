import {Router} from "express";
import {ioc} from "../IoCContainer";


export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices',
  ioc.jwtService.checkRefreshTokenInBlackListAndVerify,
  ioc.devicesController.getAllDevices.bind(ioc.devicesController))

  .delete('/devices',
    ioc.jwtService.checkRefreshTokenInBlackListAndVerify,
    ioc.devicesController.deleteAllDevicesExceptCurrent.bind(ioc.devicesController))

  .delete('/devices/:deviceId',
    ioc.jwtService.checkRefreshTokenInBlackListAndVerify,
    ioc.devicesController.deleteDeviceByDeviceId.bind(ioc.devicesController))

