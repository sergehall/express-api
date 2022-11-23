import {BlackListIPDBType} from "../types/tsTypes";
import {MyModelBlackListIP} from "../mongoose/BlackListIPSchemaModel";
import {injectable} from "inversify";

@injectable()
export class BlackListIPRepository {
  async checkoutIPinBlackList(ip: string): Promise<BlackListIPDBType | null> {
    return await MyModelBlackListIP.findOne({ip: ip})
  }
}