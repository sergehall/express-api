import {
  PayloadType,
  SessionDevicesType,
  SessionTypeArray
} from "../types/types";
import {DevicesRepository} from "../repositories/securityDevices-db-repository";


export class DevicesService {
  constructor(private devicesRepository: DevicesRepository) {
    this.devicesRepository = devicesRepository
  }
  async createOrUpdateDevices(filter: {} , newDevices: SessionDevicesType): Promise<Boolean> {
    return await this.devicesRepository.createOrUpdateDevices(filter, newDevices)
  }

  async getAllDevices(payload: PayloadType): Promise<SessionTypeArray> {
    return await this.devicesRepository.getAllDevices(payload)
  }

  async deleteAllDevicesExceptCurrent(payloadRefreshToken: PayloadType): Promise<Boolean> {
    return await this.devicesRepository.deleteAllDevicesExceptCurrent(payloadRefreshToken)
  }

  async deleteDeviceByDeviceId(deviceId: string, payloadRefreshToken: PayloadType): Promise<String> {
    return await this.devicesRepository.deleteDeviceByDeviceId(deviceId, payloadRefreshToken)
  }
  async deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken: PayloadType): Promise<String> {
    return await this.devicesRepository.deleteDeviceByDeviceIdAfterLogout(payloadRefreshToken)
  }
}