import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {PayloadType, SessionTypeArray} from "../types/all_types";


export class SecurityDevicesRepository {

  async getAllDevices(payload: PayloadType): Promise<SessionTypeArray> {
    try {
      const findAllDevices = await MyModelDevicesSchema.find(
        {userId: payload.userId, expirationDate: {$gt: new Date().toISOString()}},
        {
          _id: false,
          __v: false,
          userId: false,
          expirationDate: false
        })
      console.log(findAllDevices.length, "getAllDevicesArray", findAllDevices)
      return findAllDevices

    } catch (e) {
      console.log(e)
      return []
    }
  }

  async deleteAllDevicesExceptCurrent(payloadRefreshToken: PayloadType): Promise<Boolean> {
    try {
      await MyModelDevicesSchema.deleteMany(
        {
          userId: payloadRefreshToken.userId,
          deviceId: {$ne: payloadRefreshToken.deviceId}
        })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken: PayloadType): Promise<String> {
    try {
      const delById = await MyModelDevicesSchema.deleteOne(
        {
          userId: payloadRefreshToken.userId,
          deviceId: payloadRefreshToken.deviceId
        })

      if (delById.deletedCount === 0) {
        throw new Error("403");
      }
      return "204"

    } catch (e: any) {
      if (e.toString().split(" ")[1] == "404") {
        return "404"
      }
      if (e.toString().split(" ")[1] == "403") {
        return "403"
      } else {
        return e.toString()
      }
    }
  }

  async deleteDeviceByDeviceId(deviceId: string, payloadRefreshToken: PayloadType): Promise<String> {
    try {
      const findByDeviceId = await MyModelDevicesSchema.findOne(
        {deviceId: deviceId}
      ).lean()
      if (!findByDeviceId) {
        throw new Error("404");
      }
      if (findByDeviceId && findByDeviceId.userId !== payloadRefreshToken.userId) {
        throw new Error("403");
      }

      await MyModelDevicesSchema.deleteOne({deviceId: deviceId})

      return "204"

    } catch (e: any) {
      if (e.toString().split(" ")[1] == "404") {
        return "404"
      }
      if (e.toString().split(" ")[1] == "403") {
        return "403"
      } else {
        return e.toString()
      }
    }
  }
}