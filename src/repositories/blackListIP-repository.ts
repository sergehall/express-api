import {blackListIPCollection} from "./db";
import {BlackListIPDBType} from "../types/all_types";


export class BlackListIPRepository {
  // accepts 5 registrations from the same IP and then rejects.
  async checkoutIPinBlackList(ip: string): Promise<BlackListIPDBType | null> {
    const maxAttempts = 20;
    const foundUser = await blackListIPCollection.findOne({ip: ip})
    if (!foundUser) {
      const createdAt = (+(new Date)).toString()
      const newIp = {
        ip,
        countTimes: [{
          createdAt: createdAt
        }]
      }
      await blackListIPCollection.insertOne(newIp)
      return newIp;
    }
    const updatedUserCountTimes = {
      ...foundUser,
      ip,
      countTimes: [...foundUser.countTimes, ...[{createdAt: (+(new Date)).toString()}]]
    }

    if (foundUser.countTimes.length < maxAttempts) {
      await blackListIPCollection.updateOne({ip: ip}, {$set: updatedUserCountTimes})
      return updatedUserCountTimes
    } else {
      return null
    }
  }
}