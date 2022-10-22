import {Router} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";


export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices',
  jwtService.checkRefreshTokenInBlackListAndVerify,
  ioc.securityDevicesController.getAllDevices.bind(ioc.securityDevicesController))

  .delete('/devices',
    jwtService.checkRefreshTokenInBlackListAndVerify,
    ioc.securityDevicesController.deleteAllDevicesExceptCurrent.bind(ioc.securityDevicesController))

  .delete('/devices/:deviceId',
    jwtService.checkRefreshTokenInBlackListAndVerify,
    ioc.securityDevicesController.deleteDeviceByDeviceId.bind(ioc.securityDevicesController))

