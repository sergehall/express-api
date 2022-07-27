import {MyModeLast10secRegConf} from "../mongoose/Last10secRegConfModel";
import {MyModeLast10secReg} from "../mongoose/Last10secRegModel";
import {MyModeLast10secLog} from "../mongoose/Last10secLogModel";
import {MyModeLast10secRedEmailRes} from "../mongoose/Last10secRegEmailResModel";

export class UsersIPLast10secRepositories {
  async findByIpAndTimeRegConf(clientIp: string | null): Promise<number> {
    await MyModeLast10secRegConf.create({"ip": clientIp, "createdAt": new Date()})
    return await MyModeLast10secRegConf.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
  async findByIpAndTimeReg(clientIp: string | null): Promise<number> {
    await MyModeLast10secReg.create({"ip": clientIp, "createdAt": new Date()})
    return await MyModeLast10secReg.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
  async findByIpAndTimeLog(clientIp: string | null): Promise<number> {
    await MyModeLast10secLog.create({"ip": clientIp, "createdAt": new Date()})
    return await MyModeLast10secLog.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
  async findByIpAndTimeRegEmailRes(clientIp: string | null): Promise<number> {
    await MyModeLast10secRedEmailRes.create({"ip": clientIp, "createdAt": new Date()})
    return await MyModeLast10secRedEmailRes.countDocuments({$and: [{"ip": clientIp, "createdAt": {$gte: new Date(Date.now() - 1000 * 10)}}]})
  }
}