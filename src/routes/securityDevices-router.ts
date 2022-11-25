import {Router} from "express";
import {myContainer} from "../types/container";
import {SecurityDevicesController} from "../presentation/deviceController";
import {JWTService} from "../application/jwt-service";


export const securityDevicesRouter = Router({})

const securityDevicesController = myContainer.resolve<SecurityDevicesController>(SecurityDevicesController)
const jwtService = myContainer.resolve<JWTService>(JWTService)

securityDevicesRouter.get('/devices',
  jwtService.verifyRefreshTokenAndCheckInBlackList,
  securityDevicesController.getAllDevices.bind(securityDevicesController))

  .delete('/devices',
    jwtService.verifyRefreshTokenAndCheckInBlackList,
    securityDevicesController.deleteAllDevicesExceptCurrent.bind(securityDevicesController))

  .delete('/devices/:deviceId',
    jwtService.verifyRefreshTokenAndCheckInBlackList,
    securityDevicesController.deleteDeviceByDeviceId.bind(securityDevicesController))

