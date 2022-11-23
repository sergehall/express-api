import {
  PayloadType,
  SessionDevicesType,
  SessionTypeArray
} from "../types/types";
import {SecurityDevicesRepository} from "../repositories/securityDevices-db-repository";

export class SecurityDevicesService {
  constructor(protected securityDevicesRepository: SecurityDevicesRepository) {
  }

  async updateDevices(currentPayload: PayloadType,  newPayload: PayloadType, clientIp: string | null, userAgent: string): Promise<Boolean> {
    const filter = {userId: currentPayload.userId, deviceId: currentPayload.deviceId}
    const newDevices: SessionDevicesType = {
      userId: currentPayload.userId,
      ip: clientIp,
      title: userAgent,
      lastActiveDate: new Date(newPayload.iat * 1000).toISOString(),
      expirationDate: new Date(newPayload.exp * 1000).toISOString(),
      deviceId: currentPayload.deviceId
    }
    return await this.securityDevicesRepository.createOrUpdateDevices(filter, newDevices)
  }
  async createDevices(newPayload: PayloadType, clientIp: string | null, userAgent: string): Promise<Boolean> {
    const filter = {userId: newPayload.userId, deviceId: newPayload.deviceId}
    const newDevices: SessionDevicesType = {
      userId: newPayload.userId,
      ip: clientIp,
      title: userAgent,
      lastActiveDate: new Date(newPayload.iat * 1000).toISOString(),
      expirationDate: new Date(newPayload.exp * 1000).toISOString(),
      deviceId: newPayload.deviceId
    }
    return await this.securityDevicesRepository.createOrUpdateDevices(filter, newDevices)
  }
  async getAllDevices(payload: PayloadType): Promise<SessionTypeArray> {
    return await this.securityDevicesRepository.getAllDevices(payload)
  }

  async deleteAllDevicesExceptCurrent(payloadRefreshToken: PayloadType): Promise<Boolean> {
    return await this.securityDevicesRepository.deleteAllDevicesExceptCurrent(payloadRefreshToken)
  }

  async deleteDeviceByDeviceId(deviceId: string, payloadRefreshToken: PayloadType): Promise<String> {
    return await this.securityDevicesRepository.deleteDeviceByDeviceId(deviceId, payloadRefreshToken)
  }

  async deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken: PayloadType): Promise<String> {
    return await this.securityDevicesRepository.deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken)
  }
}