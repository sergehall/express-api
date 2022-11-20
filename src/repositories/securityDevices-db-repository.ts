import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {
  FilterUpdateDevicesType,
  PayloadType,
  SessionDevicesType,
  SessionTypeArray
} from "../types/types";


export class SecurityDevicesRepository {

  async createOrUpdateDevices(filter: FilterUpdateDevicesType , newDevices: SessionDevicesType): Promise<Boolean> {
    try {
      return await MyModelDevicesSchema.findOneAndUpdate(
        filter,
        {
          $set: newDevices
        },
        {upsert: true}).lean()
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async getAllDevices(payload: PayloadType): Promise<SessionTypeArray> {
    try {
      return await MyModelDevicesSchema.find(
        {userId: payload.userId, expirationDate: {$gt: new Date().toISOString()}},
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
      return await MyModelDevicesSchema.deleteMany(
        {
          $and: [
            {userId: payloadRefreshToken.userId},
            {deviceId: {$ne: payloadRefreshToken.deviceId}}]
        }).lean()
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken: PayloadType): Promise<String> {
    try {
      await MyModelDevicesSchema.deleteOne(
        {
          $and: [
            {userId: payloadRefreshToken.userId},
            {deviceId: payloadRefreshToken.deviceId}]
        })
      return "204"
    } catch (e: any) {
      return e.toString()
    }
  }

  async deleteDeviceByDeviceId(deviceId: string, payloadRefreshToken: PayloadType): Promise<String> {
    try {
      const findByDeviceId = await MyModelDevicesSchema.findOne(
        {deviceId: deviceId}
      ).lean()
      if (!findByDeviceId) {
        return "404"
      }
      if (findByDeviceId && findByDeviceId.userId !== payloadRefreshToken.userId) {
        return "403"
      }
      await MyModelDevicesSchema.deleteOne({deviceId: deviceId})
      return "204"

    } catch (e: any) {
      return e.toString()
    }
  }
}