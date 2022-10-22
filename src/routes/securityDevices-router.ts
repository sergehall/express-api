import {Router} from "express";
import {jwtService} from "../application/jwt-service";
import {ioc} from "../IoCContainer";


export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices',
  jwtService.verifyRefreshToken,
  ioc.securityDevicesController.getAllDevices.bind(ioc.securityDevicesController))

  .delete('/devices',
    jwtService.verifyRefreshToken,
    ioc.securityDevicesController.deleteAllDevicesExceptCurrent.bind(ioc.securityDevicesController))

  .delete('/devices/:deviceId',
    jwtService.verifyRefreshToken,
    ioc.securityDevicesController.deleteDeviceByDeviceId.bind(ioc.securityDevicesController))

