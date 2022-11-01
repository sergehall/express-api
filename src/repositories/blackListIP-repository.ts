import {BlackListIPDBType} from "../types/all_types";
import {MyModelBlackListIP} from "../mongoose/BlackListIPSchemaModel";


export class BlackListIPRepository {
  // accepts 5 registrations from the same IP and then rejects.
  async checkoutIPinBlackList(ip: string): Promise<BlackListIPDBType | null> {
    const foundUser: BlackListIPDBType | null = await MyModelBlackListIP.findOne({ip: ip})
    if (!foundUser) {
      const createdAt = (new Date).toISOString()
      const newIp = {
        ip,
        countTimes: [{
          createdAt: createdAt
        }]
      }
      await MyModelBlackListIP.create(newIp)
      return newIp;
    }

    const copyFoundUser: BlackListIPDBType = {
      ...foundUser
    }

    copyFoundUser.countTimes.push({createdAt: (new Date).toISOString()})

    await MyModelBlackListIP.findOneAndUpdate(
      {ip: ip},
      {
        $set: copyFoundUser
      })

    return copyFoundUser
  }
}