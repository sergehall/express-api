import {SecurityDevicesService} from "../domain/securityDevices-service";
import {Request, Response} from "express";


const base64 = require('base-64');

export class SecurityDevicesController {
  constructor(private securityDevicesService: SecurityDevicesService) {
  }

  async getAllDevices(req: Request, res: Response) {
    console.log("getAllDevices")
    const getDevices = await this.securityDevicesService.getAllDevices()
    console.log("getDevices",getDevices)
    return res.send(getDevices)
  }

  async deleteAllDevicesExceptCurrent(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken
      const payloadRefreshToken = JSON.parse(base64.decode(refreshToken.split('.')[1]))
      await this.securityDevicesService.deleteAllDevicesExceptCurrent(payloadRefreshToken)
      return res.sendStatus(204)
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }
  async deleteAllDevicesByDeviceId(req: Request, res: Response) {
    try {
      const deletedId = req.body.deviceId
      console.log(deletedId, "deletedId")
      return res.sendStatus(204)
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }
}