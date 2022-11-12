import {Router} from "express";
import {ioc} from "../IoCContainer";


export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices',
  ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
  ioc.securityDevicesController.getAllDevices.bind(ioc.securityDevicesController))

  .delete('/devices',
    ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
    ioc.securityDevicesController.deleteAllDevicesExceptCurrent.bind(ioc.securityDevicesController))

  .delete('/devices/:deviceId',
    ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
    ioc.securityDevicesController.deleteDeviceByDeviceId.bind(ioc.securityDevicesController))

