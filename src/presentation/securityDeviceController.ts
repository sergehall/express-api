import {DevicesService} from "../domain/devices-service";
import {Request, Response} from "express";
import {PayloadType} from "../types/types";
import {ioc} from "../IoCContainer";


export class DevicesController {
  constructor(private devicesService: DevicesService) {
  }

  async getAllDevices(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken
    const payload: PayloadType = ioc.jwtService.jwt_decode(refreshToken);
    const getDevices = await this.devicesService.getAllDevices(payload)
    return res.send(getDevices)
  }

  async deleteAllDevicesExceptCurrent(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken
      const payloadRefreshToken: PayloadType = ioc.jwtService.jwt_decode(refreshToken)
      await this.devicesService.deleteAllDevicesExceptCurrent(payloadRefreshToken)
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
      const payloadRefreshToken: PayloadType = ioc.jwtService.jwt_decode(refreshToken)

      const result = await this.devicesService.deleteDeviceByDeviceId(deletedId, payloadRefreshToken)
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