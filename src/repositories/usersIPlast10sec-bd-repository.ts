import {
  usersIPLast10secCollectionLog,
  usersIPLast10secCollectionReg,
  usersIPLast10secCollectionRegConf,
  usersIPLast10secCollectionRegEmailRes,
} from "./db";


export class UsersIPLast10secRepositories {
  async findByIpAndTimeRegConf(clientIp: string | null): Promise<number> {
    await usersIPLast10secCollectionRegConf.insertOne({"ip": clientIp, "createdAt": new Date()})
    return await usersIPLast10secCollectionRegConf.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
  async findByIpAndTimeReg(clientIp: string | null): Promise<number> {
    await usersIPLast10secCollectionReg.insertOne({"ip": clientIp, "createdAt": new Date()})
    return await usersIPLast10secCollectionReg.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
  async findByIpAndTimeLog(clientIp: string | null): Promise<number> {
    await usersIPLast10secCollectionLog.insertOne({"ip": clientIp, "createdAt": new Date()})
    return await usersIPLast10secCollectionLog.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
  async findByIpAndTimeRegEmailRes(clientIp: string | null): Promise<number> {
    await usersIPLast10secCollectionRegEmailRes.insertOne({"ip": clientIp, "createdAt": new Date()})
    return await usersIPLast10secCollectionRegEmailRes.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
}