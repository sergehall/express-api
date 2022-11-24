import {Router} from "express";
import {container} from "../Container";
import {SecurityDevicesController} from "../presentation/deviceController";
import {JWTService} from "../application/jwt-service";


export const securityDevicesRouter = Router({})

const securityDevicesController = container.resolve<SecurityDevicesController>(SecurityDevicesController)
const jwtService = container.resolve<JWTService>(JWTService)

securityDevicesRouter.get('/devices',
  jwtService.verifyRefreshTokenAndCheckInBlackList,
  securityDevicesController.getAllDevices.bind(securityDevicesController))

  .delete('/devices',
    jwtService.verifyRefreshTokenAndCheckInBlackList,
    securityDevicesController.deleteAllDevicesExceptCurrent.bind(securityDevicesController))

  .delete('/devices/:deviceId',
    jwtService.verifyRefreshTokenAndCheckInBlackList,
    securityDevicesController.deleteDeviceByDeviceId.bind(securityDevicesController))

