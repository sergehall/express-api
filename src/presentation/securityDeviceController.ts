import {SecurityDevicesService} from "../domain/securityDevices-service";
import {Request, Response} from "express";


const base64 = require('base-64');

export class SecurityDevicesController {
  constructor(private securityDevicesService: SecurityDevicesService) {
  }

  async getAllDevices(req: Request, res: Response) {
    const getDevices = await this.securityDevicesService.getAllDevices()
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
  async deleteDeviceByDeviceId(req: Request, res: Response) {
    try {
      const deletedId = req.params.deviceId
      const refreshToken = req.cookies.refreshToken
      const payloadRefreshToken = JSON.parse(base64.decode(refreshToken.split('.')[1]))

      const result = await this.securityDevicesService.deleteDeviceByDeviceId(deletedId, payloadRefreshToken)
      if (result === "204") {
        return res.sendStatus(204)
      }
      if (result === "404") {
        return res.sendStatus(404)
      }
      if (result === "403") {
        return res.sendStatus(403)
      }
      return res.send({result: result})
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }
  }
}