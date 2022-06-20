import {usersIPLast10secCollection} from "./db";


export class UsersIPLast10secRepository {
  async findByIpAndTime(clientIp: string | null): Promise<number> {
    await usersIPLast10secCollection.insertOne({"ip": clientIp, "createdAt": new Date()})
    return await usersIPLast10secCollection.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 20)}}]})
  }
}