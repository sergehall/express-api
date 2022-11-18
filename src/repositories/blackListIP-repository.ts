import {BlackListIPDBType} from "../types/types";
import {MyModelBlackListIP} from "../mongoose/BlackListIPSchemaModel";


export class BlackListIPRepository {
  async checkoutIPinBlackList(ip: string): Promise<BlackListIPDBType | null> {
    return await MyModelBlackListIP.findOne({ip: ip})
  }
}