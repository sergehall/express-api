import {PayloadType, SessionTypeArray} from "../types/all_types";
import {SecurityDevicesRepository} from "../repositories/securityDevices-db-repository";


export class SecurityDevicesService {
  constructor(private securityDevicesRepository: SecurityDevicesRepository) {
    this.securityDevicesRepository = securityDevicesRepository
  }
  async getAllDevices(): Promise<SessionTypeArray> {
    return await this.securityDevicesRepository.getAllDevices()
  }
  async deleteAllDevicesExceptCurrent(payloadRefreshToken: PayloadType): Promise<Boolean> {
    return await this.securityDevicesRepository.deleteAllDevicesExceptCurrent(payloadRefreshToken)
  }
}