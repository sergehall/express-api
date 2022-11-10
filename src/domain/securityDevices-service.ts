import {PayloadType, SessionTypeArray} from "../types/types";
import {SecurityDevicesRepository} from "../repositories/securityDevices-db-repository";


export class SecurityDevicesService {
  constructor(private securityDevicesRepository: SecurityDevicesRepository) {
    this.securityDevicesRepository = securityDevicesRepository
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