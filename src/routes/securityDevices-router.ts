import {Router} from "express";
import {ioc} from "../IoCContainer";
import {container} from "../Container";
import {SecurityDevicesController} from "../presentation/deviceController";


export const securityDevicesRouter = Router({})

const securityDevicesController = container.resolve<SecurityDevicesController>(SecurityDevicesController)

securityDevicesRouter.get('/devices',
  ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
  securityDevicesController.getAllDevices.bind(securityDevicesController))

  .delete('/devices',
    ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
    securityDevicesController.deleteAllDevicesExceptCurrent.bind(securityDevicesController))

  .delete('/devices/:deviceId',
    ioc.jwtService.verifyRefreshTokenAndCheckInBlackList,
    securityDevicesController.deleteDeviceByDeviceId.bind(securityDevicesController))

