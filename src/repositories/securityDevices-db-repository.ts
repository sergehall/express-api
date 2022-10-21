import {MyModelDevicesSchema} from "../mongoose/DevicesSchemaModel";
import {PayloadType, SessionTypeArray} from "../types/all_types";


export class SecurityDevicesRepository {
  async getAllDevices(): Promise<SessionTypeArray> {
    try {
      return await MyModelDevicesSchema.find({}, {
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
      await MyModelDevicesSchema.deleteMany({
        $and: [
          {userId: payloadRefreshToken.userId },
          {deviceId: {$ne: payloadRefreshToken.deviceId }}
        ]
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}