import {BlackListIPDBType} from "../types/all_types";
import {MyModelBlackListIP} from "../mongoose/BlackListIPSchemaModel";


export class BlackListIPRepository {
  // accepts 5 registrations from the same IP and then rejects.
  async checkoutIPinBlackList(ip: string): Promise<BlackListIPDBType | null> {
    const maxAttempts = 50;
    const foundUser = await MyModelBlackListIP.findOne({ip: ip})
    if (!foundUser) {
      const createdAt = new Date
      const newIp = {
        ip,
        countTimes: [{
          createdAt: createdAt
        }]
      }
      await MyModelBlackListIP.create(newIp)
      return newIp;
    }
    const updatedUserCountTimes = {
      ...foundUser,
      ip,
      countTimes: [...foundUser.countTimes, ...[{createdAt: new Date}]]
    }

    if (foundUser.countTimes.length < maxAttempts) {
      await MyModelBlackListIP.updateOne({ip: ip}, {$set: updatedUserCountTimes})
      return updatedUserCountTimes
    } else {
      return null
    }
  }
}