import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {PayloadType, SessionTypeArray} from "../types/all_types";


export class SecurityDevicesRepository {
  async getAllDevices(): Promise<SessionTypeArray> {
    try {
      return await MyModelDevicesSchema.find(
        {"expirationDate": {$gte: new Date().toISOString()}},
        {
          _id: false,
          __v: false,
          userId: false,
          expirationDate: false
        })

    } catch (e) {
      console.log(e)
      return []
    }
  }

  async deleteAllDevicesExceptCurrent(payloadRefreshToken: PayloadType): Promise<Boolean> {
    try {
      await MyModelDevicesSchema.deleteMany(
        {deviceId: {$ne: payloadRefreshToken.deviceId}})
      // await MyModelDevicesSchema.deleteMany({
      //   $and: [
      //     {userId: payloadRefreshToken.userId},
      //     {deviceId: {$ne: payloadRefreshToken.deviceId}}
      //   ]
      // })
      return true
    } catch (e) {
      console.log(e)
      return false
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
      const delById = await MyModelDevicesSchema.deleteOne({
        $and: [
          {userId: payloadRefreshToken.userId},
          {deviceId: deviceId}
        ]
      }).lean()
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
}